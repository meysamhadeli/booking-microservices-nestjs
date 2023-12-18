import { DynamicModule } from '@nestjs/common';
import { RabbitmqOptions } from './rabbitmq-connection';
export declare class RabbitmqModule {
    static forRoot(options?: RabbitmqOptions): DynamicModule;
}
