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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqConnection = void 0;
const common_1 = require("@nestjs/common");
const amqp = __importStar(require("amqplib"));
const configs_1 = __importDefault(require("../../configs/configs"));
let RabbitmqConnection = class RabbitmqConnection {
    constructor() {
        this.connection = null;
        this.channel = null;
    }
    onModuleInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializeConnection();
        });
    }
    initializeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.connection || this.connection == undefined) {
                    this.connection = yield amqp.connect(`amqp://${configs_1.default.rabbitmq.host}:${configs_1.default.rabbitmq.port}`, {
                        username: configs_1.default.rabbitmq.username,
                        password: configs_1.default.rabbitmq.password
                    });
                    common_1.Logger.log('RabbitMq connection created successfully');
                }
            }
            catch (error) {
                throw new Error('Rabbitmq connection failed!');
            }
        });
    }
    getChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.connection) {
                    yield this.initializeConnection();
                }
                if ((this.connection && !this.channel) || !this.channel) {
                    this.channel = yield this.connection.createChannel();
                    common_1.Logger.log('Channel Created successfully');
                }
                return this.channel;
            }
            catch (error) {
                common_1.Logger.error('Failed to get channel!');
            }
        });
    }
    closeChanel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.channel) {
                    yield this.channel.close();
                    common_1.Logger.log('Channel closed successfully');
                }
            }
            catch (error) {
                common_1.Logger.error('Channel close failed!');
            }
        });
    }
    closeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.connection) {
                    yield this.connection.close();
                    common_1.Logger.log('Connection closed successfully');
                }
            }
            catch (error) {
                common_1.Logger.error('Connection close failed!');
            }
        });
    }
};
exports.RabbitmqConnection = RabbitmqConnection;
exports.RabbitmqConnection = RabbitmqConnection = __decorate([
    (0, common_1.Injectable)()
], RabbitmqConnection);
//# sourceMappingURL=rabbitmq-connection.js.map