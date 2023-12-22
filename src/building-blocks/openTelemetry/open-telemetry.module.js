"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OpenTelemetryModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenTelemetryModule = void 0;
const common_1 = require("@nestjs/common");
const open_telemetry_tracer_1 = require("./open-telemetry-tracer");
let OpenTelemetryModule = OpenTelemetryModule_1 = class OpenTelemetryModule {
    async onApplicationShutdown(signal) { }
    static forRoot(options) {
        return {
            module: OpenTelemetryModule_1,
            providers: [open_telemetry_tracer_1.OpenTelemetryTracer, { provide: open_telemetry_tracer_1.OpenTelemetryOptions, useValue: options }]
        };
    }
};
exports.OpenTelemetryModule = OpenTelemetryModule;
exports.OpenTelemetryModule = OpenTelemetryModule = OpenTelemetryModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [{
                provide: 'IOpenTelemetryTracer',
                useClass: open_telemetry_tracer_1.OpenTelemetryTracer
            }],
        exports: ['IOpenTelemetryTracer']
    })
], OpenTelemetryModule);
//# sourceMappingURL=open-telemetry.module.js.map