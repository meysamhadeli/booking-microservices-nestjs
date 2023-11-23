import { Injectable, Logger } from '@nestjs/common';
import { RabbitmqConnection } from './rabbitmq.connection';
import { serializeObject } from '../../utils/serilization';
import { getTypeName } from '../../utils/reflection';
import { snakeCase } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { getUnixTime } from 'date-fns';

@Injectable()
export class RabbitmqPublisher {
    constructor(private readonly rabbitMQConnection: RabbitmqConnection) {}

    async publishMessage<T>(message: T): Promise<void> {
        try {
            const channel = await this.rabbitMQConnection.getChannel();

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
        } catch (error) {
            Logger.error(error);
            await this.rabbitMQConnection.closeChanel();
        }
    }
}
