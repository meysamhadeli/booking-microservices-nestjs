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
const rabbitmq_publisher_1 = require("./rabbitmq-publisher");
const rabbitmq_subscriber_1 = require("./rabbitmq-subscriber");
const rabbitmq_connection_1 = require("./rabbitmq-connection");
const open_telemetry_module_1 = require("../openTelemetry/open-telemetry.module");
const open_telemetry_tracer_1 = require("../openTelemetry/open-telemetry-tracer");
const create_catalog_1 = require("../../consumers/create-catalog");
const catalog_contracts_1 = require("../../contracts/catalog.contracts");
let RabbitmqModule = class RabbitmqModule {
};
exports.RabbitmqModule = RabbitmqModule;
exports.RabbitmqModule = RabbitmqModule = __decorate([
    (0, common_1.Module)({
        imports: [open_telemetry_module_1.OpenTelemetryModule],
        providers: [
            rabbitmq_connection_1.RabbitmqConnection,
            rabbitmq_publisher_1.RabbitmqPublisher,
            {
                provide: rabbitmq_subscriber_1.RabbitmqSubscriber,
                useFactory: (rabbitMQConnection, openTelemetryTracer) => new rabbitmq_subscriber_1.RabbitmqSubscriber(rabbitMQConnection, openTelemetryTracer, new catalog_contracts_1.CatalogCreated(), create_catalog_1.createCatalogConsumerHandler),
                inject: [rabbitmq_connection_1.RabbitmqConnection, open_telemetry_tracer_1.OpenTelemetryTracer],
            },
        ],
        exports: [rabbitmq_publisher_1.RabbitmqPublisher],
    })
], RabbitmqModule);
//# sourceMappingURL=rabbitmq.module.js.map