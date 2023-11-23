// https://blog.devops.dev/building-a-hopping-good-scalable-event-driven-nest-js-app-with-rabbitmq-5f646717f82d
// rabbit-mq/rabbit-mq.server.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQServer implements OnModuleInit {
    private readonly url = 'amqp://localhost';

    async onModuleInit(): Promise<void> {
        const connection = await amqp.connect(this.url);
        const channel = await connection.createChannel();
        const queue = 'rpc_queue';
        await channel.assertQueue(queue, { durable: false });

        // Consume messages from the queue
        channel.consume(queue, async (msg) => {
            if (msg) {
                const message = msg.content.toString();
                console.log(`Received message: ${message}`);

                const response = `Processed: ${message}`;

                // Send the response back to the client
                channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(response),
                    {
                        correlationId: msg.properties.correlationId,
                    },
                );

                channel.ack(msg);
            }
        });
    }
}
