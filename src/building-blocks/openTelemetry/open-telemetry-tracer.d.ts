import { OnModuleInit } from '@nestjs/common';
import { Tracer } from '@opentelemetry/api';
export declare class OpenTelemetryOptions {
    jaegerEndpoint?: string;
    zipkinEndpoint?: string;
    serviceName: string;
    constructor(partial?: Partial<OpenTelemetryOptions>);
}
export interface IOpenTelemetryTracer {
    createTracer(options: OpenTelemetryOptions): Promise<Tracer>;
}
export declare class OpenTelemetryTracer implements IOpenTelemetryTracer, OnModuleInit {
    private readonly options;
    constructor(options: OpenTelemetryOptions);
    onModuleInit(): Promise<void>;
    createTracer(options: OpenTelemetryOptions): Promise<Tracer>;
}
