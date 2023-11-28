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
const core_1 = require("@nestjs/core");
const catalog_module_1 = require("../catalog/catalog.module");
const typeorm_1 = require("@nestjs/typeorm");
const data_source_1 = require("../data/data-source");
const user_module_1 = require("../user/user.module");
const open_telemetry_module_1 = require("building-blocks/src/modules/openTelemetry/open-telemetry.module");
const rabbitmq_module_1 = require("building-blocks/src/modules/rabbitmq/rabbitmq.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            open_telemetry_module_1.OpenTelemetryModule,
            rabbitmq_module_1.RabbitmqModule,
            typeorm_1.TypeOrmModule.forRoot(data_source_1.postgresOptions),
            catalog_module_1.CatalogModule,
            user_module_1.UserModule,
            core_1.RouterModule.register([
                {
                    path: 'catalogs',
                    module: catalog_module_1.CatalogModule,
                },
                {
                    path: 'users',
                    module: user_module_1.UserModule,
                },
            ]),
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map