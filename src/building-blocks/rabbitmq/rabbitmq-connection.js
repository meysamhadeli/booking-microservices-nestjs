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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqConnection = void 0;
const common_1 = require("@nestjs/common");
const amqp = __importStar(require("amqplib"));
const configs_1 = __importDefault(require("../configs/configs"));
const async_retry_1 = __importDefault(require("async-retry"));
let RabbitmqConnection = class RabbitmqConnection {
    constructor() {
        this.connection = null;
        this.channel = null;
    }
    async onModuleInit() {
        await this.initializeConnection();
    }
    async getChannel() {
        try {
            if (!this.connection) {
                await this.initializeConnection();
            }
            if ((this.connection && !this.channel) || !this.channel) {
                await (0, async_retry_1.default)(async () => {
                    this.channel = await this.connection.createChannel();
                    common_1.Logger.log('Channel Created successfully');
                }, {
                    retries: configs_1.default.retry.count,
                    factor: configs_1.default.retry.factor,
                    minTimeout: configs_1.default.retry.minTimeout,
                    maxTimeout: configs_1.default.retry.maxTimeout
                });
            }
            return this.channel;
        }
        catch (error) {
            common_1.Logger.error('Failed to get channel!');
        }
    }
    async closeChanel() {
        try {
            if (this.channel) {
                await this.channel.close();
                common_1.Logger.log('Channel closed successfully');
            }
        }
        catch (error) {
            common_1.Logger.error('Channel close failed!');
        }
    }
    async closeConnection() {
        try {
            if (this.connection) {
                await this.connection.close();
                common_1.Logger.log('Connection closed successfully');
            }
        }
        catch (error) {
            common_1.Logger.error('Connection close failed!');
        }
    }
    async initializeConnection() {
        try {
            if (!this.connection || this.connection == undefined) {
                await (0, async_retry_1.default)(async () => {
                    this.connection = await amqp.connect(`amqp://${configs_1.default.rabbitmq.host}:${configs_1.default.rabbitmq.port}`, {
                        username: configs_1.default.rabbitmq.username,
                        password: configs_1.default.rabbitmq.password
                    });
                    common_1.Logger.log('RabbitMq connection created successfully');
                }, {
                    retries: configs_1.default.retry.count,
                    factor: configs_1.default.retry.factor,
                    minTimeout: configs_1.default.retry.minTimeout,
                    maxTimeout: configs_1.default.retry.maxTimeout
                });
            }
        }
        catch (error) {
            throw new Error('Rabbitmq connection failed!');
        }
    }
};
exports.RabbitmqConnection = RabbitmqConnection;
exports.RabbitmqConnection = RabbitmqConnection = __decorate([
    (0, common_1.Injectable)()
], RabbitmqConnection);
//# sourceMappingURL=rabbitmq-connection.js.map