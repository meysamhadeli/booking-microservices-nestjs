"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const config_1 = __importDefault(require("../config/config"));
exports.dataSourceOptions = {
    type: 'postgres',
    host: config_1.default.postgres.host,
    port: config_1.default.postgres.port,
    username: config_1.default.postgres.username,
    password: config_1.default.postgres.password,
    database: config_1.default.postgres.database,
    synchronize: config_1.default.postgres.synchronize,
    entities: [config_1.default.postgres.entities],
    migrations: [config_1.default.postgres.migrations],
    logging: config_1.default.postgres.logging,
};
const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;
//# sourceMappingURL=data-source-options.js.map