import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqConnection {
    private connection: amqp.Connection = null;
    private channel: amqp.Channel = null;

    constructor() {
        this.initializeConnection();
    }

    private async initializeConnection(): Promise<void> {
        try {
            if (!this.connection || this.connection == undefined) {
                this.connection = await amqp.connect('amqp://localhost:5672', {
                    username: 'guest',
                    password: 'guest',
                });

                Logger.log('RabbitMq connection created successfully');
            }
        } catch (error) {
            throw new Error('Rabbitmq connection failed!');
        }
    }

    async getChannel(): Promise<amqp.Channel> {
        try {
            if (!this.connection) {
                await this.initializeConnection();
            }

            if ((this.connection && !this.channel) || !this.channel) {
                this.channel = await this.connection.createChannel();
                Logger.log('Channel Created successfully');
            }
            return this.channel;
        } catch (error) {
            Logger.error('Failed to get channel!');
        }
    }

    async closeChanel(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
                Logger.log('Channel closed successfully');
            }
        } catch (error) {
            Logger.error('Channel close failed!');
        }
    }

    async closeConnection(): Promise<void> {
        try {
            if (this.connection) {
                await this.connection.close();
                Logger.log('Connection closed successfully');
            }
        } catch (error) {
            Logger.error('Connection close failed!');
        }
    }
}
