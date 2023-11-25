import { OnModuleInit } from '@nestjs/common';
import {
    BatchSpanProcessor,
    NodeTracerProvider,
} from '@opentelemetry/sdk-trace-node';
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
import config from '../../config/config';

const zipkinExporter = new ZipkinExporter({
    url: config.monitoring.zipkinEndpoint,
    serviceName: config.serviceName,
});

const jaegerExporter = new JaegerExporter({
    endpoint: config.monitoring.jaegerEndpoint,
});

export const otelSDK = initializeOpenTelemetrySDK();

function initializeOpenTelemetrySDK() {
    console.log(config.serviceName);
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
        }),
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
            new AmqplibInstrumentation(),
        ],
    });
}

export class OpenTelemetryTracer implements OnModuleInit {
    onModuleInit(): void {
        otelSDK.start();
    }

    createTracer(tracerName: string): Tracer {
        const tracer = trace.getTracer(tracerName);
        return tracer;
    }
}
