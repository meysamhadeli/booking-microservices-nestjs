import {Inject, Injectable, Logger} from '@nestjs/common';
import { RabbitmqConnection } from './rabbitmq-connection';
import { getTypeName } from '../utils/reflection';
import { snakeCase } from 'lodash';
import { deserializeObject } from '../utils/serilization';
import {IOpenTelemetryTracer, OpenTelemetryTracer} from '../openTelemetry/open-telemetry-tracer';
import { sleep } from '../utils/time';
import configs from '../configs/configs';
import asyncRetry from 'async-retry';

type handlerFunc<T> = (queue: string, message: T) => void;
const consumedMessages: string[] = [];

export interface IRabbitmqConsumer {
  consumeMessage<T>(type: T, handler: handlerFunc<T>): Promise<void>;
  isConsumed<T>(message: T): Promise<boolean>;
}

@Injectable()
export class RabbitmqConsumer<T> implements IRabbitmqConsumer {
  constructor(
    private readonly rabbitMQConnection: RabbitmqConnection,
    @Inject('IOpenTelemetryTracer') private readonly openTelemetryTracer: IOpenTelemetryTracer
  ) {}

  async consumeMessage<T>(type: T, handler: handlerFunc<T>): Promise<void> {
    try {
      await asyncRetry(
        async () => {
          const channel = await this.rabbitMQConnection.getChannel();

          const tracer = await this.openTelemetryTracer.createTracer({ serviceName: 'rabbitmq_subscriber_tracer' });

          const exchangeName = snakeCase(getTypeName(type));

          await channel.assertExchange(exchangeName, 'fanout', {
            durable: false
          });

          const q = await channel.assertQueue('', { exclusive: true });

          await channel.bindQueue(q.queue, exchangeName, '');

          Logger.log(
            `Waiting for messages with exchange name "${exchangeName}". To exit, press CTRL+C`
          );

          await channel.consume(
            q.queue,
            (message) => {
              if (message !== null) {
                const span = tracer.startSpan(`receive_message_${exchangeName}`);

                const messageContent = message?.content?.toString();
                const headers = message.properties.headers || {};

                handler(q.queue, deserializeObject<T>(messageContent));

                Logger.log(
                  `Message: ${messageContent} delivered to queue: ${q.queue} with exchange name ${exchangeName}`
                );
                channel.ack(message);

                consumedMessages.push(exchangeName);

                span.setAttributes(headers);
                span.end();
              }
            },
            { noAck: false } // Ensure that we acknowledge messages
          );
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

  async isConsumed<T>(message: T): Promise<boolean> {
    const timeoutTime = 30000; // 30 seconds in milliseconds
    const startTime = Date.now();
    let timeOutExpired = false;
    let isConsumed = false;

    while (true) {
      if (timeOutExpired) {
        return false;
      }
      if (isConsumed) {
        return true;
      }

      await sleep(2000);

      const exchangeName = snakeCase(getTypeName(message));

      isConsumed = consumedMessages.includes(exchangeName);

      timeOutExpired = Date.now() - startTime > timeoutTime;
    }
  }
}
