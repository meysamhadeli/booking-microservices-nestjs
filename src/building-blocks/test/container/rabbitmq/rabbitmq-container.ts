import 'reflect-metadata';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Logger } from '@nestjs/common';
import configs from '../../../configs/configs';

export interface RabbitmqContainerOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  imageName: string;
}

export class RabbitmqContainer {
  public async start(): Promise<StartedTestContainer> {
    const defaultRabbitmqOptions = await this.getDefaultRabbitmqTestContainers();

    const rabbitmqContainerStarted = await this.getContainerStarted(defaultRabbitmqOptions);

    const containerPort = rabbitmqContainerStarted.getMappedPort(defaultRabbitmqOptions.port);

    configs.rabbitmq = {
      ...configs.rabbitmq,
      port: containerPort,
      username: defaultRabbitmqOptions.username,
      password: defaultRabbitmqOptions.password,
      host: defaultRabbitmqOptions.host
    };

    Logger.log(`Test rabbitmq with port ${containerPort} established`);

    return rabbitmqContainerStarted;
  }

  private async getContainerStarted(
    options: RabbitmqContainerOptions
  ): Promise<StartedTestContainer> {
    const rabbitmqContainer = new GenericContainer(options.imageName)
      .withExposedPorts(options.port)
      .withEnvironment({ RABBITMQ_DEFAULT_USER: options.username })
      .withEnvironment({ RABBITMQ_DEFAULT_PASS: options.password?.toString() });
    const rabbitmqContainerStarted = await rabbitmqContainer.start();

    return rabbitmqContainerStarted;
  }

  private async getDefaultRabbitmqTestContainers(): Promise<RabbitmqContainerOptions> {
    const rabbitmqOptions: RabbitmqContainerOptions = {
      port: 5672,
      host: 'localhost',
      username: 'guest',
      password: 'guest',
      imageName: 'rabbitmq:management'
    };

    return rabbitmqOptions;
  }
}
