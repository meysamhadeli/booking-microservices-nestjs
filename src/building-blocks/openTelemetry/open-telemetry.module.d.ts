import { DynamicModule, OnApplicationShutdown } from '@nestjs/common';
import { OpenTelemetryOptions } from './open-telemetry-tracer';
export declare class OpenTelemetryModule implements OnApplicationShutdown {
    onApplicationShutdown(signal?: string): Promise<void>;
    static forRoot(options?: OpenTelemetryOptions): DynamicModule;
}
