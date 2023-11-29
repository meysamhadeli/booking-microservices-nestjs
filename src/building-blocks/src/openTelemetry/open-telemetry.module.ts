import { Module } from '@nestjs/common';
import { OpenTelemetryTracer } from './open-telemetry-tracer';

@Module({
  providers: [OpenTelemetryTracer],
  exports: [OpenTelemetryTracer]
})
export class OpenTelemetryModule {}
