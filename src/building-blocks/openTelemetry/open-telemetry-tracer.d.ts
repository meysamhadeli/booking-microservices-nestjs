import { OnModuleInit } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Tracer } from '@opentelemetry/api';
export declare class OpenTelemetryOptions {
    jaegerEndpoint: string;
    zipkinEndpoint: string;
    serviceName: string;
    constructor(partial?: Partial<OpenTelemetryOptions>);
}
export interface IOpenTelemetryTracer {
    createTracer(tracerName: string): Tracer;
}
export declare const otelSDK: NodeSDK;
export declare class OpenTelemetryTracer implements IOpenTelemetryTracer, OnModuleInit {
    private readonly options?;
    constructor(options?: OpenTelemetryOptions);
    onModuleInit(): void;
    createTracer(tracerName: string): Tracer;
}
