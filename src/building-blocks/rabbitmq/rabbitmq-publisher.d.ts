import { RabbitmqConnection } from './rabbitmq-connection';
import { OtelDiagnosticsProvider } from '../opentelemetry/otel-diagnostics-provider';
export interface IRabbitmqPublisher {
    publishMessage<T>(message: T): Promise<void>;
    isPublished<T>(message: T): Promise<boolean>;
}
export declare class RabbitmqPublisher implements IRabbitmqPublisher {
    private readonly rabbitMQConnection;
    private readonly otelDiagnosticsProvider;
    constructor(rabbitMQConnection: RabbitmqConnection, otelDiagnosticsProvider: OtelDiagnosticsProvider);
    publishMessage<T>(message: T): Promise<void>;
    isPublished<T>(message: T): Promise<boolean>;
}
