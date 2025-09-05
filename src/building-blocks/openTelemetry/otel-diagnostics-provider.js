"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtelDiagnosticsProvider = void 0;
const api_1 = __importDefault(require("@opentelemetry/api"));
const api_logs_1 = require("@opentelemetry/api-logs");
const configs_1 = __importDefault(require("../configs/configs"));
class OtelDiagnosticsProvider {
    getInstrumentationName() {
        return configs_1.default.opentelemetry.serviceName;
    }
    getTracer() {
        return api_1.default.trace.getTracer(configs_1.default.opentelemetry.serviceName, configs_1.default.opentelemetry.serviceVersion ?? '1.0.0');
    }
    getMeter() {
        return api_1.default.metrics.getMeter(configs_1.default.opentelemetry.serviceName, configs_1.default.opentelemetry.serviceVersion ?? '1.0.0');
    }
    getLogger() {
        return api_logs_1.logs.getLogger(configs_1.default.opentelemetry.serviceName, configs_1.default.opentelemetry.serviceVersion ?? '1.0.0');
    }
    getCurrentSpan() {
        return api_1.default.trace.getActiveSpan();
    }
    getSpanFromContext(ctx) {
        return api_1.default.trace.getSpan(ctx);
    }
}
exports.OtelDiagnosticsProvider = OtelDiagnosticsProvider;
//# sourceMappingURL=otel-diagnostics-provider.js.map