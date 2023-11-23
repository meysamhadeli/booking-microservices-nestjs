// https://blog.devops.dev/building-a-hopping-good-scalable-event-driven-nest-js-app-with-rabbitmq-5f646717f82d
// rabbit-mq/rabbit-mq.publisher.ts

import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQPublisher {
    private readonly url = 'amqp://localhost';

    async publishMessage(
        exchange: string,
        routingKey: string,
        message: string,
    ): Promise<void> {
        const connection = await amqp.connect(this.url);
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'direct', { durable: false });

        // Publish the message
        channel.publish(exchange, routingKey, Buffer.from(message));
        console.log(`Sent message: ${message}`);

        setTimeout(() => {
            connection.close();
        }, 500);
    }
}
