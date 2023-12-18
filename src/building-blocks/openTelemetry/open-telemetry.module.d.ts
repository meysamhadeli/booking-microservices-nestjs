import { DynamicModule } from '@nestjs/common';
import { OpenTelemetryOptions } from './open-telemetry-tracer';
export declare class OpenTelemetryModule {
    static forRoot(options?: OpenTelemetryOptions): DynamicModule;
}
