import { DynamicModule, OnApplicationShutdown } from '@nestjs/common';
import { RabbitmqConnection, RabbitmqOptions } from './rabbitmq-connection';
export declare class RabbitmqModule implements OnApplicationShutdown {
    private readonly rabbitmqConnection;
    constructor(rabbitmqConnection: RabbitmqConnection);
    onApplicationShutdown(signal?: string): Promise<void>;
    static forRoot(options?: RabbitmqOptions): DynamicModule;
}
