import { OnModuleInit } from '@nestjs/common';
import {
    BatchSpanProcessor,
    NodeTracerProvider,
} from '@opentelemetry/sdk-trace-node';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
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

const zipkinExporter = new ZipkinExporter({
    url: 'http://zipkin-server:9411/api/v2/spans',
    serviceName: 'Tracer_Service_Name',
});

const jaegerExporter = new JaegerExporter({
    endpoint: 'http://localhost:14268/api/traces',
});

export const otelSDK = initializeOpenTelemetrySDK();

function initializeOpenTelemetrySDK() {
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: 'Tracer_Service_Name',
        }),
    });

    provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));

    provider.addSpanProcessor(new BatchSpanProcessor(zipkinExporter));

    provider.register();

    registerInstrumentations({
        instrumentations: [
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
            new NestInstrumentation(),
            new AmqplibInstrumentation(),
        ],
    });

    return new NodeSDK({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: 'Tracer_Service_Name',
        }),
        spanProcessor: new SimpleSpanProcessor(jaegerExporter),
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
