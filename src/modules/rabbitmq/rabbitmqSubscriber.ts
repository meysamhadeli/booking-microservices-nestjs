import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitmqConnection } from './rabbitmqConnection';
import { getTypeName } from '../../utils/reflection';
import { snakeCase } from 'lodash';
import { deserializeObject } from '../../utils/serilization';
import { OpenTelemetryTracer } from '../openTelemetry/openTelemetryTracer';

type handlerFunc<T> = (queue: string, message: T) => void;

@Injectable()
export class RabbitmqSubscriber<T> implements OnModuleInit {
    constructor(
        private readonly rabbitMQConnection: RabbitmqConnection,
        private readonly openTelemetryTracer: OpenTelemetryTracer,
        private readonly type: T,
        private readonly handler: handlerFunc<T>,
    ) {}

    async onModuleInit(): Promise<void> {
        try {
            const channel = await this.rabbitMQConnection.getChannel();

            const tracer = await this.openTelemetryTracer.createTracer(
                'rabbitmq_subscriber_tracer',
            );

            const exchangeName = snakeCase(getTypeName(this.type));

            await channel.assertExchange(exchangeName, 'fanout', {
                durable: false,
            });

            const q = await channel.assertQueue('', { exclusive: true });

            await channel.bindQueue(q.queue, exchangeName, '');

            Logger.log(
                `Waiting for messages with exchange name "${exchangeName}". To exit, press CTRL+C`,
            );

            await channel.consume(
                q.queue,
                (message) => {
                    if (message !== null) {
                        const span = tracer.startSpan(`receive_message_${exchangeName}`);

                        const messageContent = message?.content?.toString();
                        const headers = message.properties.headers || {};

                        this.handler(
                            q.queue,
                            deserializeObject<T>(messageContent),
                        );
                        Logger.log(
                            `Message: ${messageContent} delivered to queue: ${q.queue} with exchange name ${exchangeName}`,
                        );
                        channel.ack(message);

                        span.setAttributes(headers);
                        span.end();
                    }
                },
                { noAck: false }, // Ensure that we acknowledge messages
            );
        } catch (error) {
            Logger.error(error);
            await this.rabbitMQConnection.closeChanel();
        }
    }
}
