import { Module } from '@nestjs/common';
import { OpenTelemetryTracer } from './openTelemetryTracer';

@Module({
    providers: [OpenTelemetryTracer],
    exports: [OpenTelemetryTracer],
})
export class OpenTelemetryModule {}
