import 'reflect-metadata';
import { StartedTestContainer } from 'testcontainers';
import { DataSourceOptions, EntitySchema, MixedList } from "typeorm";
export interface PostgresContainerOptions {
    imageName: string;
    type: string;
    database: string;
    port: number;
    host: string;
    username: string;
    password: string;
    synchronize: boolean;
    entities: MixedList<string | EntitySchema>;
    migrationsRun: boolean;
}
export declare class PostgresContainer {
    start(): Promise<[StartedTestContainer, DataSourceOptions]>;
    private getContainerStarted;
    private getDefaultPostgresTestContainers;
}
