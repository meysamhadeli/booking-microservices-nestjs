// https://blog.devops.dev/building-a-hopping-good-scalable-event-driven-nest-js-app-with-rabbitmq-5f646717f82d
// rabbit-mq/rabbit-mq.publisher.ts

import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { serializeObject } from '../../../utils/serilization';
import { getTypeName } from '../../../utils/reflection';
import { snakeCase } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { getUnixTime } from 'date-fns';

@Injectable()
export class RabbitMQPublisher {
    private readonly url = 'amqp://localhost';

    async publishMessage<T>(message: T): Promise<void> {
        const connection = await amqp.connect(this.url);
        const channel = await connection.createChannel();

        const exchangeName = snakeCase(getTypeName(message));
        const serializedMessage = serializeObject(message);

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

        // Publish the message
        Logger.log(`Sent message: ${message}`);

        setTimeout(() => {
            connection.close();
        }, 500);
    }
}
