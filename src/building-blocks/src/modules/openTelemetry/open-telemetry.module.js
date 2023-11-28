"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenTelemetryModule = void 0;
const common_1 = require("@nestjs/common");
const open_telemetry_tracer_1 = require("./open-telemetry-tracer");
let OpenTelemetryModule = class OpenTelemetryModule {
};
exports.OpenTelemetryModule = OpenTelemetryModule;
exports.OpenTelemetryModule = OpenTelemetryModule = __decorate([
    (0, common_1.Module)({
        providers: [open_telemetry_tracer_1.OpenTelemetryTracer],
        exports: [open_telemetry_tracer_1.OpenTelemetryTracer]
    })
], OpenTelemetryModule);
//# sourceMappingURL=open-telemetry.module.js.map