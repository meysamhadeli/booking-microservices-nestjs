import { OnModuleInit } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Tracer } from '@opentelemetry/api';
export declare const otelSDK: NodeSDK;
export declare class OpenTelemetryTracer implements OnModuleInit {
    onModuleInit(): void;
    createTracer(tracerName: string): Tracer;
}
