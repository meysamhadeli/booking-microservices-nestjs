"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresContainer = void 0;
require("reflect-metadata");
const testcontainers_1 = require("testcontainers");
const common_1 = require("@nestjs/common");
class PostgresContainer {
    async start() {
        const defaultPostgresOptions = await this.getDefaultPostgresTestContainers();
        const pgContainerStarted = await this.getContainerStarted(defaultPostgresOptions);
        const containerPort = pgContainerStarted.getMappedPort(defaultPostgresOptions.port);
        const dataSourceOptions = {
            ...defaultPostgresOptions,
            type: 'postgres',
            port: containerPort
        };
        common_1.Logger.log(`Test postgres with port ${containerPort} established`);
        return [pgContainerStarted, dataSourceOptions];
    }
    async getContainerStarted(options) {
        const pgContainer = new testcontainers_1.GenericContainer(options.imageName)
            .withExposedPorts(options.port)
            .withEnvironment({ POSTGRES_USER: options.username })
            .withEnvironment({ POSTGRES_PASSWORD: options.password?.toString() })
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
            synchronize: true,
            migrationsRun: false,
            entities: ['src/**/entities/*.{js,ts}']
        };
        return postgresOptions;
    }
}
exports.PostgresContainer = PostgresContainer;
//# sourceMappingURL=postgres-container.js.map