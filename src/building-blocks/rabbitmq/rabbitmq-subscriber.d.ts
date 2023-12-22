import { RabbitmqConnection } from './rabbitmq-connection';
import { IOpenTelemetryTracer } from '../openTelemetry/open-telemetry-tracer';
type handlerFunc<T> = (queue: string, message: T) => void;
export interface IRabbitmqConsumer {
    consumeMessage<T>(type: T, handler: handlerFunc<T>): Promise<void>;
    isConsumed<T>(message: T): Promise<boolean>;
}
export declare class RabbitmqConsumer<T> implements IRabbitmqConsumer {
    private readonly rabbitMQConnection;
    private readonly openTelemetryTracer;
    constructor(rabbitMQConnection: RabbitmqConnection, openTelemetryTracer: IOpenTelemetryTracer);
    consumeMessage<T>(type: T, handler: handlerFunc<T>): Promise<void>;
    isConsumed<T>(message: T): Promise<boolean>;
}
export {};
