"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RabbitmqModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqModule = void 0;
const common_1 = require("@nestjs/common");
const rabbitmq_publisher_1 = require("./rabbitmq-publisher");
const rabbitmq_connection_1 = require("./rabbitmq-connection");
const open_telemetry_module_1 = require("../openTelemetry/open-telemetry.module");
const rabbitmq_subscriber_1 = require("./rabbitmq-subscriber");
let RabbitmqModule = RabbitmqModule_1 = class RabbitmqModule {
    static forRoot(options) {
        return {
            module: RabbitmqModule_1,
            providers: [rabbitmq_connection_1.RabbitmqConnection, { provide: rabbitmq_connection_1.RabbitmqOptions, useValue: options }]
        };
    }
};
exports.RabbitmqModule = RabbitmqModule;
exports.RabbitmqModule = RabbitmqModule = RabbitmqModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [open_telemetry_module_1.OpenTelemetryModule.forRoot()],
        providers: [
            rabbitmq_publisher_1.RabbitmqPublisher,
            {
                provide: 'IRabbitmqConnection',
                useClass: rabbitmq_connection_1.RabbitmqConnection
            },
            {
                provide: 'IRabbitmqPublisher',
                useClass: rabbitmq_publisher_1.RabbitmqPublisher
            },
            {
                provide: 'IRabbitmqConsumer',
                useClass: rabbitmq_subscriber_1.RabbitmqConsumer
            }
        ],
        exports: ['IRabbitmqConnection', 'IRabbitmqPublisher', 'IRabbitmqConsumer']
    })
], RabbitmqModule);
//# sourceMappingURL=rabbitmq.module.js.map