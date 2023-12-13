import 'reflect-metadata';
import { StartedTestContainer } from 'testcontainers';
import { DataSourceOptions } from "typeorm";
export interface PostgresContainerOptions {
    imageName: string;
    type: string;
    database: string;
    port: number;
    host: string;
    username: string;
    password: string;
    synchronize: boolean;
    entities: string;
}
export declare class PostgresContainer {
    start(): Promise<[StartedTestContainer, DataSourceOptions]>;
    private getContainerStarted;
    private getDefaultPostgresTestContainers;
}
