import {DynamicModule, Global, Module} from '@nestjs/common';
import {OpenTelemetryOptions, OpenTelemetryTracer} from './open-telemetry-tracer';
@Global()
@Module({
  providers: [OpenTelemetryTracer],
  exports: [OpenTelemetryTracer]
})
export class OpenTelemetryModule {
  static forRoot(options?: OpenTelemetryOptions): DynamicModule {
    return {
      module: OpenTelemetryModule,
      providers: [OpenTelemetryTracer, { provide: OpenTelemetryOptions, useValue: options }]
    };
  }
}
