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
const open_telemetry_module_1 = require("../modules/openTelemetry/open-telemetry.module");
const rabbitmq_module_1 = require("../modules/rabbitmq/rabbitmq.module");
const request_duration_middleware_1 = require("../modules/monitorings/request-duration.middleware");
const request_counter_middleware_1 = require("../modules/monitorings/request-counter.middleware");
const core_1 = require("@nestjs/core");
const catalog_module_1 = require("../catalog/catalog.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(request_counter_middleware_1.RequestCounterMiddleware, request_duration_middleware_1.RequestDurationMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            open_telemetry_module_1.OpenTelemetryModule,
            rabbitmq_module_1.RabbitmqModule,
            catalog_module_1.CatalogModule,
            core_1.RouterModule.register([
                {
                    path: 'catalogs',
                    module: catalog_module_1.CatalogModule,
                },
            ]),
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map