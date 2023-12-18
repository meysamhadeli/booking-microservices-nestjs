import { Injectable, Logger } from '@nestjs/common';
import {IRabbitmqConnection, RabbitmqConnection} from './rabbitmq-connection';
import { serializeObject } from '../utils/serilization';
import { getTypeName } from '../utils/reflection';
import { snakeCase } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { getUnixTime } from 'date-fns';
import { OpenTelemetryTracer } from '../openTelemetry/open-telemetry-tracer';
import configs from '../configs/configs';
import asyncRetry from 'async-retry';

const publishedMessages: string[] = [];

export interface IRabbitmqPublisher {
  publishMessage<T>(message: T): Promise<void>;
  isPublished<T>(message: T): Promise<boolean>;
}

@Injectable()
export class RabbitmqPublisher implements IRabbitmqPublisher {
  constructor(
    private readonly rabbitMQConnection: RabbitmqConnection,
    private readonly openTelemetryTracer: OpenTelemetryTracer
  ) {}

  async publishMessage<T>(message: T): Promise<void> {
    try {
      await asyncRetry(
        async () => {
          const channel = await this.rabbitMQConnection.getChannel();

          const tracer = await this.openTelemetryTracer.createTracer('rabbitmq_publisher_tracer');

          const exchangeName = snakeCase(getTypeName(message));
          const serializedMessage = serializeObject(message);

          const span = tracer.startSpan(`publish_message_${exchangeName}`);

          await channel.assertExchange(exchangeName, 'fanout', {
            durable: false
          });

          const messageProperties = {
            messageId: uuidv4().toString(),
            timestamp: getUnixTime(new Date()),
            contentType: 'application/json',
            exchange: exchangeName,
            type: 'fanout'
          };

          channel.publish(exchangeName, '', Buffer.from(serializedMessage), {
            headers: messageProperties
          });

          Logger.log(`Message: ${serializedMessage} sent with exchange name "${exchangeName}"`);

          publishedMessages.push(exchangeName);

          span.setAttributes(messageProperties);

          span.end();
        },
        {
          retries: configs.retry.count,
          factor: configs.retry.factor,
          minTimeout: configs.retry.minTimeout,
          maxTimeout: configs.retry.maxTimeout
        }
      );
    } catch (error) {
      Logger.error(error);
      await this.rabbitMQConnection.closeChanel();
    }
  }

  async isPublished<T>(message: T): Promise<boolean> {
    const exchangeName = snakeCase(getTypeName(message));

    const isPublished = publishedMessages.includes(exchangeName);

    return Promise.resolve(isPublished);
  }
}
