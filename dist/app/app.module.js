"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const openTelemetryModule_1 = require("../modules/openTelemetry/openTelemetryModule");
const rabbitmqModule_1 = require("../modules/rabbitmq/rabbitmqModule");
const requestDurationMiddleware_1 = require("../modules/monitorings/requestDurationMiddleware");
const requestCounterMiddleware_1 = require("../modules/monitorings/requestCounterMiddleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(requestCounterMiddleware_1.RequestCounterMiddleware, requestDurationMiddleware_1.RequestDurationMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [openTelemetryModule_1.OpenTelemetryModule, rabbitmqModule_1.RabbitmqModule],
        controllers: [app_controller_1.AppController],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map