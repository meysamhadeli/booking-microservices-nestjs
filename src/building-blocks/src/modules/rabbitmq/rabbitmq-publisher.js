"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqPublisher = void 0;
const common_1 = require("@nestjs/common");
const rabbitmq_connection_1 = require("./rabbitmq-connection");
const serilization_1 = require("../../utils/serilization");
const reflection_1 = require("../../utils/reflection");
const lodash_1 = require("lodash");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const open_telemetry_tracer_1 = require("../openTelemetry/open-telemetry-tracer");
let RabbitmqPublisher = class RabbitmqPublisher {
    constructor(rabbitMQConnection, openTelemetryTracer) {
        this.rabbitMQConnection = rabbitMQConnection;
        this.openTelemetryTracer = openTelemetryTracer;
    }
    publishMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield this.rabbitMQConnection.getChannel();
                const tracer = yield this.openTelemetryTracer.createTracer('rabbitmq_publisher_tracer');
                const exchangeName = (0, lodash_1.snakeCase)((0, reflection_1.getTypeName)(message));
                const serializedMessage = (0, serilization_1.serializeObject)(message);
                const span = tracer.startSpan(`publish_message_${exchangeName}`);
                yield channel.assertExchange(exchangeName, 'fanout', {
                    durable: false
                });
                const messageProperties = {
                    messageId: (0, uuid_1.v4)().toString(),
                    timestamp: (0, date_fns_1.getUnixTime)(new Date()),
                    contentType: 'application/json',
                    exchange: exchangeName,
                    type: 'fanout'
                };
                channel.publish(exchangeName, '', Buffer.from(serializedMessage), {
                    headers: messageProperties
                });
                common_1.Logger.log(`Message: ${serializedMessage} sent with exchange name "${exchangeName}"`);
                span.setAttributes(messageProperties);
                span.end();
            }
            catch (error) {
                common_1.Logger.error(error);
                yield this.rabbitMQConnection.closeChanel();
            }
        });
    }
};
exports.RabbitmqPublisher = RabbitmqPublisher;
exports.RabbitmqPublisher = RabbitmqPublisher = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rabbitmq_connection_1.RabbitmqConnection,
        open_telemetry_tracer_1.OpenTelemetryTracer])
], RabbitmqPublisher);
//# sourceMappingURL=rabbitmq-publisher.js.map