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
        configs_1.default.rabbitmq = Object.assign(Object.assign({}, configs_1.default.rabbitmq), { port: containerPort, username: defaultRabbitmqOptions.username, password: defaultRabbitmqOptions.password, host: defaultRabbitmqOptions.host });
        common_1.Logger.log(`Test rabbitmq with port ${containerPort} established`);
        return rabbitmqContainerStarted;
    }
    async getContainerStarted(options) {
        var _a;
        const rabbitmqContainer = new testcontainers_1.GenericContainer(options.imageName)
            .withExposedPorts(options.port)
            .withEnvironment({ RABBITMQ_DEFAULT_USER: options.username })
            .withEnvironment({ RABBITMQ_DEFAULT_PASS: (_a = options.password) === null || _a === void 0 ? void 0 : _a.toString() });
        const rabbitmqContainerStarted = await rabbitmqContainer.start();
        return rabbitmqContainerStarted;
    }
    async getDefaultRabbitmqTestContainers() {
        const rabbitmqOptions = {
            port: 5672,
            host: 'localhost',
            username: 'guest',
            password: 'guest',
            imageName: 'rabbitmq:3-management'
        };
        return rabbitmqOptions;
    }
}
exports.RabbitmqContainer = RabbitmqContainer;
//# sourceMappingURL=rabbitmq-container.js.map