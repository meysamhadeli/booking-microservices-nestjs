import { Injectable, Logger } from '@nestjs/common';
import { RabbitmqConnection } from './rabbitmq-connection';
import { serializeObject } from '../../utils/serilization';
import { getTypeName } from '../../utils/reflection';
import { snakeCase } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { getUnixTime } from 'date-fns';
import { OpenTelemetryTracer } from '../openTelemetry/open-telemetry-tracer';

@Injectable()
export class RabbitmqPublisher {
    constructor(
        private readonly rabbitMQConnection: RabbitmqConnection,
        private readonly openTelemetryTracer: OpenTelemetryTracer,
    ) {}

    async publishMessage<T>(message: T): Promise<void> {
        try {
            const channel = await this.rabbitMQConnection.getChannel();

            const tracer = await this.openTelemetryTracer.createTracer(
                'rabbitmq_publisher_tracer',
            );

            const exchangeName = snakeCase(getTypeName(message));
            const serializedMessage = serializeObject(message);

            const span = tracer.startSpan(`publish_message_${exchangeName}`);

            await channel.assertExchange(exchangeName, 'fanout', {
                durable: false,
            });

            const messageProperties = {
                messageId: uuidv4().toString(),
                timestamp: getUnixTime(new Date()),
                contentType: 'application/json',
                exchange: exchangeName,
                type: 'fanout',
            };

            channel.publish(exchangeName, '', Buffer.from(serializedMessage), {
                headers: messageProperties,
            });

            Logger.log(
                `Message: ${serializedMessage} sent with exchange name "${exchangeName}"`,
            );

            span.setAttributes(messageProperties);

            span.end();
        } catch (error) {
            Logger.error(error);
            await this.rabbitMQConnection.closeChanel();
        }
    }
}
