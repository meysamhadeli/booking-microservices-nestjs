import { OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
export interface RabbitmqOptions {
    host: string;
    port: number;
    username: string;
    password: string;
    exchange: string;
}
export interface IRabbitMQConnection {
    getChannel(): Promise<amqp.Channel>;
    closeChanel(): Promise<void>;
    closeConnection(): Promise<void>;
}
export declare class RabbitmqConnection implements OnModuleInit, IRabbitMQConnection {
    private connection;
    private channel;
    onModuleInit(): Promise<void>;
    getChannel(): Promise<amqp.Channel>;
    closeChanel(): Promise<void>;
    closeConnection(): Promise<void>;
    private initializeConnection;
}
