import { Logger, Module } from '@nestjs/common';
import { NodeSDK, metrics } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter as OTLGrpcMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPLogExporter as OTLPGrpcLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { defaultResource, resourceFromAttributes } from '@opentelemetry/resources';
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OtelLogger } from './otel-logger';
import configs from '../configs/configs';
import { OtelDiagnosticsProvider } from './otel-diagnostics-provider';

@Module({
  controllers: [],
  providers: [
    Logger,
    OtelLogger,
    OtelDiagnosticsProvider
  ],
  exports: [OtelLogger, OtelDiagnosticsProvider],
})
export class OpenTelemetryModule {

  static start() {
    const otelSdk = new NodeSDK({
      resource: defaultResource().merge(
        resourceFromAttributes({
          [ATTR_SERVICE_NAME]: configs.opentelemetry.serviceName,
          [ATTR_SERVICE_VERSION]: configs.opentelemetry.serviceVersion,
        }),
      ),
      instrumentations: [getNodeAutoInstrumentations()],
      traceExporter: new OTLPTraceExporter({url: configs.opentelemetry.collectorUrl}),
      metricReader: new metrics.PeriodicExportingMetricReader({ exporter: new OTLGrpcMetricExporter({url: configs.opentelemetry.collectorUrl})}),
      logRecordProcessors: [new SimpleLogRecordProcessor(new OTLPGrpcLogExporter({url: configs.opentelemetry.collectorUrl}))],
      textMapPropagator: new CompositePropagator({ propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()]}),
    });

    process.on('SIGTERM', () => {
      otelSdk
        .shutdown()
        .then(
          () => console.log('SDK shut down successfully'),
          err => console.log('Error shutting down SDK', err),
        )
        .finally(() => process.exit(0));
    });

    otelSdk.start();
  }
}
