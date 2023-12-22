import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {BatchSpanProcessor, NodeTracerProvider} from '@opentelemetry/sdk-trace-node';
import {ZipkinExporter} from '@opentelemetry/exporter-zipkin';
import {AmqplibInstrumentation} from '@opentelemetry/instrumentation-amqplib';
import {SimpleSpanProcessor} from '@opentelemetry/sdk-trace-base';
import {HttpInstrumentation} from '@opentelemetry/instrumentation-http';
import {ExpressInstrumentation} from '@opentelemetry/instrumentation-express';
import {NestInstrumentation} from '@opentelemetry/instrumentation-nestjs-core';
import {Resource} from '@opentelemetry/resources';
import {SemanticResourceAttributes} from '@opentelemetry/semantic-conventions';
import {JaegerExporter} from '@opentelemetry/exporter-jaeger';
import {trace, Tracer} from '@opentelemetry/api';
import configs from '../configs/configs';
import {NodeSDK} from "@opentelemetry/sdk-node";

export class OpenTelemetryOptions {
  jaegerEndpoint?: string;
  zipkinEndpoint?: string;
  serviceName: string;

  constructor(partial?: Partial<OpenTelemetryOptions>) {
    Object.assign(this, partial);
  }
}

let openTelemetryOptions: OpenTelemetryOptions = new OpenTelemetryOptions();

const otelSDK = initSdk();

async function initSdk() {

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: openTelemetryOptions?.serviceName ?? configs.serviceName
    })
  });

  const jaegerExporter = new JaegerExporter({
    endpoint: openTelemetryOptions?.jaegerEndpoint ?? configs.monitoring.jaegerEndpoint
  });

  const zipkinExporter = new ZipkinExporter({
    url: openTelemetryOptions?.zipkinEndpoint ?? configs.monitoring.zipkinEndpoint,
    serviceName: openTelemetryOptions?.serviceName ?? configs.serviceName
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

export interface IOpenTelemetryTracer {
  createTracer(options: OpenTelemetryOptions): Promise<Tracer>;
}

@Injectable()
export class OpenTelemetryTracer implements IOpenTelemetryTracer, OnModuleInit {
  constructor(@Inject(OpenTelemetryOptions) private readonly options: OpenTelemetryOptions) {
    openTelemetryOptions = this.options;
  }
  async onModuleInit(): Promise<void> {
    (await otelSDK).start();
  }

  async createTracer(options: OpenTelemetryOptions): Promise<Tracer> {

    const tracer = trace.getTracer(options?.serviceName ?? configs.serviceName);
    return tracer;
  }
}

