import 'reflect-metadata';
import { StartedTestContainer } from 'testcontainers';
import { RabbitmqOptions } from "../../../rabbitmq/rabbitmq-connection";
export interface RabbitmqContainerOptions {
    host: string;
    port: number;
    username: string;
    password: string;
    imageName: string;
}
export declare class RabbitmqContainer {
    start(): Promise<[StartedTestContainer, RabbitmqOptions]>;
    private getContainerStarted;
    private getDefaultRabbitmqTestContainers;
}
