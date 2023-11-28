import { OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
export declare class RabbitmqConnection implements OnModuleInit {
    private connection;
    private channel;
    onModuleInit(): Promise<void>;
    private initializeConnection;
    getChannel(): Promise<amqp.Channel>;
    closeChanel(): Promise<void>;
    closeConnection(): Promise<void>;
}
