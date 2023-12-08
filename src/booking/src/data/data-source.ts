import { DataSource, DataSourceOptions } from 'typeorm';
import configs from "building-blocks/configs/configs";

// use this file for running migration
export const postgresOptions: DataSourceOptions = {
    type: 'postgres',
    host: configs.postgres.host,
    port: configs.postgres.port,
    username: configs.postgres.username,
    password: configs.postgres.password,
    database: configs.postgres.database,
    synchronize: configs.postgres.synchronize,
    entities: [configs.postgres.entities],
    logging: configs.postgres.logging,
};

const dataSource = new DataSource(postgresOptions);
export default dataSource;
