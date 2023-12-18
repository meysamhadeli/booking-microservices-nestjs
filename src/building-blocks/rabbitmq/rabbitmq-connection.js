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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqConnection = exports.RabbitmqOptions = void 0;
const common_1 = require("@nestjs/common");
const amqp = __importStar(require("amqplib"));
const configs_1 = __importDefault(require("../configs/configs"));
const async_retry_1 = __importDefault(require("async-retry"));
class RabbitmqOptions {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.RabbitmqOptions = RabbitmqOptions;
let connection = null;
let channel = null;
let RabbitmqConnection = class RabbitmqConnection {
    constructor(options) {
        this.options = options;
    }
    async onModuleInit() {
        await this.createConnection(this.options);
    }
    async createConnection(options) {
        var _a, _b;
        if (!connection || !connection == undefined) {
            try {
                const host = (_a = options === null || options === void 0 ? void 0 : options.host) !== null && _a !== void 0 ? _a : configs_1.default.rabbitmq.host;
                const port = (_b = options === null || options === void 0 ? void 0 : options.port) !== null && _b !== void 0 ? _b : configs_1.default.rabbitmq.port;
                await (0, async_retry_1.default)(async () => {
                    var _a, _b;
                    connection = await amqp.connect(`amqp://${host}:${port}`, {
                        username: (_a = options === null || options === void 0 ? void 0 : options.username) !== null && _a !== void 0 ? _a : configs_1.default.rabbitmq.username,
                        password: (_b = options === null || options === void 0 ? void 0 : options.password) !== null && _b !== void 0 ? _b : configs_1.default.rabbitmq.password
                    });
                }, {
                    retries: configs_1.default.retry.count,
                    factor: configs_1.default.retry.factor,
                    minTimeout: configs_1.default.retry.minTimeout,
                    maxTimeout: configs_1.default.retry.maxTimeout
                });
                connection.on('error', async (error) => {
                    common_1.Logger.error(`Error occurred on connection: ${error}`);
                    await this.closeConnection();
                    await this.createConnection();
                });
            }
            catch (error) {
                throw new Error('Rabbitmq connection is failed!');
            }
        }
        return connection;
    }
    async getChannel() {
        try {
            if (!connection) {
                throw new Error('Rabbitmq connection is failed!');
            }
            if ((connection && !channel) || !channel) {
                await (0, async_retry_1.default)(async () => {
                    channel = await connection.createChannel();
                    common_1.Logger.log('Channel Created successfully');
                }, {
                    retries: configs_1.default.retry.count,
                    factor: configs_1.default.retry.factor,
                    minTimeout: configs_1.default.retry.minTimeout,
                    maxTimeout: configs_1.default.retry.maxTimeout
                });
            }
            channel.on('error', async (error) => {
                common_1.Logger.error(`Error occurred on channel: ${error}`);
                await this.closeChanel();
                await this.getChannel();
            });
            return channel;
        }
        catch (error) {
            common_1.Logger.error('Failed to get channel!');
        }
    }
    async closeChanel() {
        try {
            if (channel) {
                await channel.close();
                common_1.Logger.log('Channel closed successfully');
            }
        }
        catch (error) {
            common_1.Logger.error('Channel close failed!');
        }
    }
    async closeConnection() {
        try {
            if (connection) {
                await connection.close();
                common_1.Logger.log('Connection closed successfully');
            }
        }
        catch (error) {
            common_1.Logger.error('Connection close failed!');
        }
    }
};
exports.RabbitmqConnection = RabbitmqConnection;
exports.RabbitmqConnection = RabbitmqConnection = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(RabbitmqOptions)),
    __metadata("design:paramtypes", [RabbitmqOptions])
], RabbitmqConnection);
//# sourceMappingURL=rabbitmq-connection.js.map