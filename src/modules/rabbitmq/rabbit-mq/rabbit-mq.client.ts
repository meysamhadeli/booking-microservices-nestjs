// https://blog.devops.dev/building-a-hopping-good-scalable-event-driven-nest-js-app-with-rabbitmq-5f646717f82d
// rabbit-mq/rabbit-mq.client.ts

import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQClient {
    private readonly url = 'amqp://localhost';

    async sendMessage(queue: string, message: string): Promise<string> {
        const connection = await amqp.connect(this.url);
        const channel = await connection.createChannel();

        const replyQueue = await channel.assertQueue('', { exclusive: true });

        // Generate a random correlation ID
        const correlationId =
            Math.random().toString() + Math.random().toString();

        // Send the message to the server
        channel.sendToQueue(queue, Buffer.from(message), {
            correlationId,
            replyTo: replyQueue.queue,
        });

        // Wait for the response from the server
        return new Promise((resolve) => {
            channel.consume(
                replyQueue.queue,
                (msg) => {
                    if (msg.properties.correlationId === correlationId) {
                        resolve(msg.content.toString());
                        connection.close();
                    }
                },
                { noAck: true },
            );
        });
    }
}
