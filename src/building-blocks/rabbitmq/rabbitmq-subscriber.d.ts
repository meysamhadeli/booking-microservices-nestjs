import { RabbitmqConnection } from './rabbitmq-connection';
import { OtelDiagnosticsProvider } from '../opentelemetry/otel-diagnostics-provider';
type handlerFunc<T> = (queue: string, message: T) => void;
export interface IRabbitmqConsumer {
    consumeMessage<T>(type: T, handler: handlerFunc<T>): Promise<void>;
    isConsumed<T>(message: T): Promise<boolean>;
}
export declare class RabbitmqConsumer<T> implements IRabbitmqConsumer {
    private readonly rabbitMQConnection;
    private readonly otelDiagnosticsProvider;
    constructor(rabbitMQConnection: RabbitmqConnection, otelDiagnosticsProvider: OtelDiagnosticsProvider);
    consumeMessage<T>(type: T, handler: handlerFunc<T>): Promise<void>;
    isConsumed<T>(message: T): Promise<boolean>;
}
export {};
