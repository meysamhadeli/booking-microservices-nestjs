"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqModule = void 0;
const common_1 = require("@nestjs/common");
const rabbitmqPublisher_1 = require("./rabbitmqPublisher");
const rabbitmqSubscriber_1 = require("./rabbitmqSubscriber");
const rabbitmqConnection_1 = require("./rabbitmqConnection");
const openTelemetryModule_1 = require("../openTelemetry/openTelemetryModule");
const openTelemetryTracer_1 = require("../openTelemetry/openTelemetryTracer");
const create_catalog_1 = require("../../consumers/create-catalog");
const catalog_contracts_1 = require("../../contracts/catalog.contracts");
let RabbitmqModule = class RabbitmqModule {
};
exports.RabbitmqModule = RabbitmqModule;
exports.RabbitmqModule = RabbitmqModule = __decorate([
    (0, common_1.Module)({
        imports: [openTelemetryModule_1.OpenTelemetryModule],
        providers: [
            rabbitmqConnection_1.RabbitmqConnection,
            rabbitmqPublisher_1.RabbitmqPublisher,
            {
                provide: rabbitmqSubscriber_1.RabbitmqSubscriber,
                useFactory: (rabbitMQConnection, openTelemetryTracer) => new rabbitmqSubscriber_1.RabbitmqSubscriber(rabbitMQConnection, openTelemetryTracer, new catalog_contracts_1.CatalogCreated(), create_catalog_1.createCatalogConsumerHandler),
                inject: [rabbitmqConnection_1.RabbitmqConnection, openTelemetryTracer_1.OpenTelemetryTracer],
            },
        ],
        exports: [rabbitmqPublisher_1.RabbitmqPublisher],
    })
], RabbitmqModule);
//# sourceMappingURL=rabbitmqModule.js.map