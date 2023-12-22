import { RabbitmqConnection } from './rabbitmq-connection';
import { IOpenTelemetryTracer } from '../openTelemetry/open-telemetry-tracer';
export interface IRabbitmqPublisher {
    publishMessage<T>(message: T): Promise<void>;
    isPublished<T>(message: T): Promise<boolean>;
}
export declare class RabbitmqPublisher implements IRabbitmqPublisher {
    private readonly rabbitMQConnection;
    private readonly openTelemetryTracer;
    constructor(rabbitMQConnection: RabbitmqConnection, openTelemetryTracer: IOpenTelemetryTracer);
    publishMessage<T>(message: T): Promise<void>;
    isPublished<T>(message: T): Promise<boolean>;
}
