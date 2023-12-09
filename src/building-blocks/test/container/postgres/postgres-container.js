"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresContainer = void 0;
require("reflect-metadata");
const testcontainers_1 = require("testcontainers");
const common_1 = require("@nestjs/common");
const configs_1 = __importDefault(require("../../../configs/configs"));
class PostgresContainer {
    async start() {
        const defaultPostgresOptions = await this.getDefaultPostgresTestContainers();
        const pgContainerStarted = await this.getContainerStarted(defaultPostgresOptions);
        const containerPort = pgContainerStarted.getMappedPort(defaultPostgresOptions.port);
        configs_1.default.postgres = Object.assign(Object.assign({}, configs_1.default.postgres), { port: containerPort, host: defaultPostgresOptions.host, username: defaultPostgresOptions.username, password: defaultPostgresOptions.password, database: defaultPostgresOptions.database, synchronize: true });
        common_1.Logger.log(`Test postgres with port ${containerPort} established`);
        return pgContainerStarted;
    }
    async getContainerStarted(options) {
        var _a;
        const pgContainer = new testcontainers_1.GenericContainer(options.imageName)
            .withExposedPorts(options.port)
            .withEnvironment({ POSTGRES_USER: options.username })
            .withEnvironment({ POSTGRES_PASSWORD: (_a = options.password) === null || _a === void 0 ? void 0 : _a.toString() })
            .withEnvironment({ POSTGRES_DB: options.database });
        const pgContainerStarted = await pgContainer.start();
        return pgContainerStarted;
    }
    async getDefaultPostgresTestContainers() {
        const postgresOptions = {
            type: 'postgres',
            database: 'test_db',
            port: 5432,
            host: 'localhost',
            username: 'testcontainers',
            password: 'testcontainers',
            imageName: 'postgres:latest',
            synchronize: true
        };
        return postgresOptions;
    }
}
exports.PostgresContainer = PostgresContainer;
//# sourceMappingURL=postgres-container.js.map