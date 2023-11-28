import { DataSource, DataSourceOptions } from 'typeorm';
import config from '../config/config';

// use this file for running migration
export const postgresOptions: DataSourceOptions = {
    type: 'postgres',
    host: config.postgres.host,
    port: config.postgres.port,
    username: config.postgres.username,
    password: config.postgres.password,
    database: config.postgres.database,
    synchronize: config.postgres.synchronize,
    entities: [config.postgres.entities],
    migrations: [config.postgres.migrations],
    logging: config.postgres.logging,
};

const dataSource = new DataSource(postgresOptions);
export default dataSource;
