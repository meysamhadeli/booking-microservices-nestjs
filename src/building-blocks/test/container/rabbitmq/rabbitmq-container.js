"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqContainer = void 0;
require("reflect-metadata");
const testcontainers_1 = require("testcontainers");
const common_1 = require("@nestjs/common");
const configs_1 = __importDefault(require("../../../configs/configs"));
class RabbitmqContainer {
    async start() {
        const defaultRabbitmqOptions = await this.getDefaultRabbitmqTestContainers();
        const rabbitmqContainerStarted = await this.getContainerStarted(defaultRabbitmqOptions);
        const containerPort = rabbitmqContainerStarted.getMappedPort(defaultRabbitmqOptions.port);
        configs_1.default.rabbitmq = {
            ...configs_1.default.rabbitmq,
            port: containerPort,
            username: defaultRabbitmqOptions.username,
            password: defaultRabbitmqOptions.password,
            host: defaultRabbitmqOptions.host
        };
        const rabbitmqOptions = {
            ...configs_1.default.rabbitmq
        };
        common_1.Logger.log(`Test rabbitmq with port ${containerPort} established`);
        return [rabbitmqContainerStarted, rabbitmqOptions];
    }
    async getContainerStarted(options) {
        const rabbitmqContainer = new testcontainers_1.GenericContainer(options.imageName)
            .withExposedPorts(options.port)
            .withEnvironment({ RABBITMQ_DEFAULT_USER: options.username })
            .withEnvironment({ RABBITMQ_DEFAULT_PASS: options.password?.toString() });
        const rabbitmqContainerStarted = await rabbitmqContainer.start();
        return rabbitmqContainerStarted;
    }
    async getDefaultRabbitmqTestContainers() {
        const rabbitmqOptions = {
            port: 5672,
            host: 'localhost',
            username: 'guest',
            password: 'guest',
            imageName: 'rabbitmq:management'
        };
        return rabbitmqOptions;
    }
}
exports.RabbitmqContainer = RabbitmqContainer;
//# sourceMappingURL=rabbitmq-container.js.map