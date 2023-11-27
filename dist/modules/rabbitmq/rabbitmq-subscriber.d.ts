import { OnModuleInit } from '@nestjs/common';
import { RabbitmqConnection } from './rabbitmq-connection';
import { OpenTelemetryTracer } from '../openTelemetry/open-telemetry-tracer';
type handlerFunc<T> = (queue: string, message: T) => void;
export declare class RabbitmqSubscriber<T> implements OnModuleInit {
    private readonly rabbitMQConnection;
    private readonly openTelemetryTracer;
    private readonly type;
    private readonly handler;
    constructor(rabbitMQConnection: RabbitmqConnection, openTelemetryTracer: OpenTelemetryTracer, type: T, handler: handlerFunc<T>);
    onModuleInit(): Promise<void>;
}
export {};