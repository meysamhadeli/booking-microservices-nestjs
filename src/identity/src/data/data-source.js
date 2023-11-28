"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresOptions = void 0;
const typeorm_1 = require("typeorm");
const configs_1 = __importDefault(require("building-blocks/src/configs/configs"));
// use this file for running migration
exports.postgresOptions = {
    type: 'postgres',
    host: configs_1.default.postgres.host,
    port: configs_1.default.postgres.port,
    username: configs_1.default.postgres.username,
    password: configs_1.default.postgres.password,
    database: configs_1.default.postgres.database,
    synchronize: configs_1.default.postgres.synchronize,
    entities: [configs_1.default.postgres.entities],
    migrations: [configs_1.default.postgres.migrations],
    logging: configs_1.default.postgres.logging,
};
const dataSource = new typeorm_1.DataSource(exports.postgresOptions);
exports.default = dataSource;
//# sourceMappingURL=data-source.js.map