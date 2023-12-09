import 'reflect-metadata';
import { StartedTestContainer } from 'testcontainers';
export interface RabbitmqContainerOptions {
    host: string;
    port: number;
    username: string;
    password: string;
    imageName: string;
}
export declare class RabbitmqContainer {
    start(): Promise<StartedTestContainer>;
    private getContainerStarted;
    private getDefaultRabbitmqTestContainers;
}
