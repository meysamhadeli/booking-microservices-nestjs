import {DynamicModule, Global, Module, OnApplicationShutdown} from '@nestjs/common';
import { OpenTelemetryOptions, OpenTelemetryTracer} from './open-telemetry-tracer';
@Global()
@Module({
  providers: [     {
    provide: 'IOpenTelemetryTracer',
    useClass: OpenTelemetryTracer
  }],
  exports: ['IOpenTelemetryTracer']
})
export class OpenTelemetryModule implements OnApplicationShutdown {

  async onApplicationShutdown(signal?: string) {}

  static forRoot(options?: OpenTelemetryOptions): DynamicModule {
    return {
      module: OpenTelemetryModule,
      providers: [OpenTelemetryTracer, { provide: OpenTelemetryOptions, useValue: options }]
    };
  }
}
