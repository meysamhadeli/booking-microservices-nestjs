"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenTelemetryModule = void 0;
const common_1 = require("@nestjs/common");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const exporter_trace_otlp_grpc_1 = require("@opentelemetry/exporter-trace-otlp-grpc");
const exporter_metrics_otlp_grpc_1 = require("@opentelemetry/exporter-metrics-otlp-grpc");
const exporter_logs_otlp_grpc_1 = require("@opentelemetry/exporter-logs-otlp-grpc");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const resources_1 = require("@opentelemetry/resources");
const core_1 = require("@opentelemetry/core");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const sdk_logs_1 = require("@opentelemetry/sdk-logs");
const otel_logger_1 = require("./otel-logger");
const configs_1 = __importDefault(require("../configs/configs"));
const otel_diagnostics_provider_1 = require("./otel-diagnostics-provider");
let OpenTelemetryModule = class OpenTelemetryModule {
    static start() {
        const otelSdk = new sdk_node_1.NodeSDK({
            resource: (0, resources_1.defaultResource)().merge((0, resources_1.resourceFromAttributes)({
                [semantic_conventions_1.ATTR_SERVICE_NAME]: configs_1.default.opentelemetry.serviceName,
                [semantic_conventions_1.ATTR_SERVICE_VERSION]: configs_1.default.opentelemetry.serviceVersion
            })),
            instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()],
            traceExporter: new exporter_trace_otlp_grpc_1.OTLPTraceExporter({ url: configs_1.default.opentelemetry.collectorUrl }),
            metricReader: new sdk_node_1.metrics.PeriodicExportingMetricReader({
                exporter: new exporter_metrics_otlp_grpc_1.OTLPMetricExporter({ url: configs_1.default.opentelemetry.collectorUrl })
            }),
            logRecordProcessors: [
                new sdk_logs_1.SimpleLogRecordProcessor(new exporter_logs_otlp_grpc_1.OTLPLogExporter({ url: configs_1.default.opentelemetry.collectorUrl }))
            ],
            textMapPropagator: new core_1.CompositePropagator({
                propagators: [new core_1.W3CTraceContextPropagator(), new core_1.W3CBaggagePropagator()]
            })
        });
        process.on('SIGTERM', () => {
            otelSdk
                .shutdown()
                .then(() => console.log('SDK shut down successfully'), (err) => console.log('Error shutting down SDK', err))
                .finally(() => process.exit(0));
        });
        otelSdk.start();
    }
};
exports.OpenTelemetryModule = OpenTelemetryModule;
exports.OpenTelemetryModule = OpenTelemetryModule = __decorate([
    (0, common_1.Module)({
        controllers: [],
        providers: [common_1.Logger, otel_logger_1.OtelLogger, otel_diagnostics_provider_1.OtelDiagnosticsProvider],
        exports: [otel_logger_1.OtelLogger, otel_diagnostics_provider_1.OtelDiagnosticsProvider]
    })
], OpenTelemetryModule);
//# sourceMappingURL=opentelemetry.module.js.map