import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import { BatchSpanProcessor, NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { trace, Tracer } from '@opentelemetry/api';
import configs from '../configs/configs';

export class OpenTelemetryOptions {
  jaegerEndpoint: string;
  zipkinEndpoint: string;
  serviceName: string;

  constructor(partial?: Partial<OpenTelemetryOptions>) {
    Object.assign(this, partial);
  }
}

let openTelemetryOptions: OpenTelemetryOptions;

export interface IOpenTelemetryTracer {
  createTracer(tracerName: string): Tracer;
}

const zipkinExporter = new ZipkinExporter({
  url: openTelemetryOptions?.zipkinEndpoint ?? configs.monitoring.zipkinEndpoint,
  serviceName: openTelemetryOptions?.serviceName ?? configs.serviceName
});

const jaegerExporter = new JaegerExporter({
  endpoint: openTelemetryOptions?.jaegerEndpoint ?? configs.monitoring.jaegerEndpoint
});

export const otelSDK = initializeOpenTelemetrySDK();

function initializeOpenTelemetrySDK() {

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: openTelemetryOptions?.serviceName ?? configs.serviceName
    })
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));

  provider.addSpanProcessor(new BatchSpanProcessor(zipkinExporter));

  provider.register();

  return new NodeSDK({
    resource: provider.resource,
    spanProcessor: provider.activeSpanProcessor,
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new NestInstrumentation(),
      new AmqplibInstrumentation()
    ]
  });
}

@Injectable()
export class OpenTelemetryTracer implements IOpenTelemetryTracer, OnModuleInit {
  constructor(@Inject(OpenTelemetryOptions) private readonly options?: OpenTelemetryOptions) {
    openTelemetryOptions = options;
  }

  onModuleInit(): void {
    otelSDK.start();
  }

  createTracer(tracerName: string): Tracer {
    const tracer = trace.getTracer(tracerName);
    return tracer;
  }
}

