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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqConsumer = void 0;
const common_1 = require("@nestjs/common");
const rabbitmq_connection_1 = require("./rabbitmq-connection");
const reflection_1 = require("../utils/reflection");
const lodash_1 = require("lodash");
const serilization_1 = require("../utils/serilization");
const open_telemetry_tracer_1 = require("../openTelemetry/open-telemetry-tracer");
const time_1 = require("../utils/time");
const configs_1 = __importDefault(require("../configs/configs"));
const async_retry_1 = __importDefault(require("async-retry"));
const consumedMessages = [];
let RabbitmqConsumer = class RabbitmqConsumer {
    constructor(rabbitMQConnection, openTelemetryTracer) {
        this.rabbitMQConnection = rabbitMQConnection;
        this.openTelemetryTracer = openTelemetryTracer;
    }
    async consumeMessage(type, handler) {
        try {
            await (0, async_retry_1.default)(async () => {
                const channel = await this.rabbitMQConnection.getChannel();
                const tracer = await this.openTelemetryTracer.createTracer('rabbitmq_subscriber_tracer');
                const exchangeName = (0, lodash_1.snakeCase)((0, reflection_1.getTypeName)(type));
                await channel.assertExchange(exchangeName, 'fanout', {
                    durable: false
                });
                const q = await channel.assertQueue('', { exclusive: true });
                await channel.bindQueue(q.queue, exchangeName, '');
                common_1.Logger.log(`Waiting for messages with exchange name "${exchangeName}". To exit, press CTRL+C`);
                await channel.consume(q.queue, (message) => {
                    var _a;
                    if (message !== null) {
                        const span = tracer.startSpan(`receive_message_${exchangeName}`);
                        const messageContent = (_a = message === null || message === void 0 ? void 0 : message.content) === null || _a === void 0 ? void 0 : _a.toString();
                        const headers = message.properties.headers || {};
                        handler(q.queue, (0, serilization_1.deserializeObject)(messageContent));
                        common_1.Logger.log(`Message: ${messageContent} delivered to queue: ${q.queue} with exchange name ${exchangeName}`);
                        channel.ack(message);
                        consumedMessages.push(exchangeName);
                        span.setAttributes(headers);
                        span.end();
                    }
                }, { noAck: false });
            }, {
                retries: configs_1.default.retry.count,
                factor: configs_1.default.retry.factor,
                minTimeout: configs_1.default.retry.minTimeout,
                maxTimeout: configs_1.default.retry.maxTimeout
            });
        }
        catch (error) {
            common_1.Logger.error(error);
            await this.rabbitMQConnection.closeChanel();
        }
    }
    async isConsumed(message) {
        const timeoutTime = 30000;
        const startTime = Date.now();
        let timeOutExpired = false;
        let isConsumed = false;
        while (true) {
            if (timeOutExpired) {
                return false;
            }
            if (isConsumed) {
                return true;
            }
            await (0, time_1.sleep)(2000);
            const exchangeName = (0, lodash_1.snakeCase)((0, reflection_1.getTypeName)(message));
            isConsumed = consumedMessages.includes(exchangeName);
            timeOutExpired = Date.now() - startTime > timeoutTime;
        }
    }
};
exports.RabbitmqConsumer = RabbitmqConsumer;
exports.RabbitmqConsumer = RabbitmqConsumer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rabbitmq_connection_1.RabbitmqConnection,
        open_telemetry_tracer_1.OpenTelemetryTracer])
], RabbitmqConsumer);
//# sourceMappingURL=rabbitmq-subscriber.js.map