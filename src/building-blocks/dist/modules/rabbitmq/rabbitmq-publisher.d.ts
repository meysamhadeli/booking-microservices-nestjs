import { RabbitmqConnection } from './rabbitmq-connection';
import { OpenTelemetryTracer } from '../openTelemetry/open-telemetry-tracer';
export declare class RabbitmqPublisher {
    private readonly rabbitMQConnection;
    private readonly openTelemetryTracer;
    constructor(rabbitMQConnection: RabbitmqConnection, openTelemetryTracer: OpenTelemetryTracer);
    publishMessage<T>(message: T): Promise<void>;
}
