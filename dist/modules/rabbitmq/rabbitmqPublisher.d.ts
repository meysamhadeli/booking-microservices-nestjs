import { RabbitmqConnection } from './rabbitmqConnection';
import { OpenTelemetryTracer } from '../openTelemetry/openTelemetryTracer';
export declare class RabbitmqPublisher {
    private readonly rabbitMQConnection;
    private readonly openTelemetryTracer;
    constructor(rabbitMQConnection: RabbitmqConnection, openTelemetryTracer: OpenTelemetryTracer);
    publishMessage<T>(message: T): Promise<void>;
}
