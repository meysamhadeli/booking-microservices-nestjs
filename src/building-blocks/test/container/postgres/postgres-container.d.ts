import 'reflect-metadata';
import { StartedTestContainer } from 'testcontainers';
export interface PostgresContainerOptions {
    imageName: string;
    type: string;
    database: string;
    port: number;
    host: string;
    username: string;
    password: string;
    synchronize: boolean;
}
export declare class PostgresContainer {
    start(): Promise<StartedTestContainer>;
    private getContainerStarted;
    private getDefaultPostgresTestContainers;
}
