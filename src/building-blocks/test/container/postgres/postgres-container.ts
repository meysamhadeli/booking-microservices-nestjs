import 'reflect-metadata';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import {Logger} from "@nestjs/common";
import {DataSourceOptions, EntitySchema, MixedList} from "typeorm";

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

export class PostgresContainer{
  public async start(): Promise<[StartedTestContainer, DataSourceOptions]>{
    const defaultPostgresOptions = await this.getDefaultPostgresTestContainers();

    const pgContainerStarted = await this.getContainerStarted(defaultPostgresOptions);

    const containerPort = pgContainerStarted.getMappedPort(defaultPostgresOptions.port);

    const dataSourceOptions: DataSourceOptions = {
      ...defaultPostgresOptions,
      type: 'postgres',
      port: containerPort
    };

    Logger.log(`Test postgres with port ${containerPort} established`);

    return [pgContainerStarted, dataSourceOptions];
  }

  private async getContainerStarted(options: PostgresContainerOptions): Promise<StartedTestContainer>{
    const pgContainer = new GenericContainer(options.imageName)
      .withExposedPorts(options.port)
      .withEnvironment({ POSTGRES_USER: options.username })
      .withEnvironment({ POSTGRES_PASSWORD: options.password?.toString() })
      .withEnvironment({ POSTGRES_DB: options.database });
    const pgContainerStarted = await pgContainer.start();

    return pgContainerStarted;
  }

  private async getDefaultPostgresTestContainers(): Promise<PostgresContainerOptions>{
    const postgresOptions: PostgresContainerOptions = {
      type: 'postgres',
      database: 'test_db',
      port: 5432,
      host: 'localhost',
      username: 'testcontainers',
      password: 'testcontainers',
      imageName: 'postgres:latest',
      synchronize: true,
      migrationsRun: false,
      entities: ['src/**/entities/*.{js,ts}']
    };

    return postgresOptions;
  }

}
