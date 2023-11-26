"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrometheusModule = void 0;
const common_1 = require("@nestjs/common");
const request_counter_middleware_1 = require("./request-counter.middleware");
const request_duration_middleware_1 = require("./request-duration.middleware");
const Prometheus = __importStar(require("prom-client"));
const core_1 = require("@nestjs/core");
let PrometheusModule = class PrometheusModule {
    constructor(app) {
        this.app = app;
    }
    configure(consumer) {
        consumer
            .apply(request_counter_middleware_1.RequestCounterMiddleware, request_duration_middleware_1.RequestDurationMiddleware)
            .forRoutes('*');
        this.app.use('/metrics', async (req, res) => {
            try {
                const metrics = await Prometheus.register.metrics();
                res.set('Content-Type', Prometheus.register.contentType);
                res.end(metrics);
            }
            catch (error) {
                common_1.Logger.error('Error generating metrics:', error);
                res.status(500).end();
            }
        });
    }
};
exports.PrometheusModule = PrometheusModule;
exports.PrometheusModule = PrometheusModule = __decorate([
    (0, common_1.Module)({}),
    __param(0, (0, common_1.Inject)(core_1.ApplicationConfig)),
    __metadata("design:paramtypes", [Object])
], PrometheusModule);
//# sourceMappingURL=prometheus.module.js.map