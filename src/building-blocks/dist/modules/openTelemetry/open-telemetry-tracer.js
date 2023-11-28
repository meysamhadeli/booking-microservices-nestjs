"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenTelemetryTracer = exports.otelSDK = void 0;
const sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
const exporter_zipkin_1 = require("@opentelemetry/exporter-zipkin");
const instrumentation_amqplib_1 = require("@opentelemetry/instrumentation-amqplib");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
const instrumentation_express_1 = require("@opentelemetry/instrumentation-express");
const instrumentation_nestjs_core_1 = require("@opentelemetry/instrumentation-nestjs-core");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const exporter_jaeger_1 = require("@opentelemetry/exporter-jaeger");
const api_1 = require("@opentelemetry/api");
const configs_1 = __importDefault(require("../../configs/configs"));
const zipkinExporter = new exporter_zipkin_1.ZipkinExporter({
    url: configs_1.default.monitoring.zipkinEndpoint,
    serviceName: configs_1.default.serviceName
});
const jaegerExporter = new exporter_jaeger_1.JaegerExporter({
    endpoint: configs_1.default.monitoring.jaegerEndpoint
});
exports.otelSDK = initializeOpenTelemetrySDK();
function initializeOpenTelemetrySDK() {
    console.log(configs_1.default.serviceName);
    const provider = new sdk_trace_node_1.NodeTracerProvider({
        resource: new resources_1.Resource({
            [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: configs_1.default.serviceName
        })
    });
    provider.addSpanProcessor(new sdk_trace_base_1.SimpleSpanProcessor(jaegerExporter));
    provider.addSpanProcessor(new sdk_trace_node_1.BatchSpanProcessor(zipkinExporter));
    provider.register();
    return new sdk_node_1.NodeSDK({
        resource: provider.resource,
        spanProcessor: provider.activeSpanProcessor,
        instrumentations: [
            new instrumentation_http_1.HttpInstrumentation(),
            new instrumentation_express_1.ExpressInstrumentation(),
            new instrumentation_nestjs_core_1.NestInstrumentation(),
            new instrumentation_amqplib_1.AmqplibInstrumentation()
        ]
    });
}
class OpenTelemetryTracer {
    onModuleInit() {
        exports.otelSDK.start();
    }
    createTracer(tracerName) {
        const tracer = api_1.trace.getTracer(tracerName);
        return tracer;
    }
}
exports.OpenTelemetryTracer = OpenTelemetryTracer;
//# sourceMappingURL=open-telemetry-tracer.js.map