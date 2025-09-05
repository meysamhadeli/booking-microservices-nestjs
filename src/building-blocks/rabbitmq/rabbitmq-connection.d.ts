import { OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
export declare class RabbitmqOptions {
    host: string;
    port: number;
    password: string;
    username: string;
    constructor(partial?: Partial<RabbitmqOptions>);
}
export interface IRabbitmqConnection {
    createConnection(options?: RabbitmqOptions): Promise<amqp.Connection>;
    getChannel(): Promise<amqp.Channel>;
    closeChanel(): Promise<void>;
    closeConnection(): Promise<void>;
}
export declare class RabbitmqConnection implements OnModuleInit, IRabbitmqConnection {
    private readonly options?;
    constructor(options?: RabbitmqOptions);
    onModuleInit(): Promise<void>;
    createConnection(options?: RabbitmqOptions): Promise<amqp.Connection>;
    getChannel(): Promise<amqp.Channel>;
    closeChanel(): Promise<void>;
    closeConnection(): Promise<void>;
}
