import { IUserRepository } from '../../../src/data/repositories/user.repository';
import { INestApplication } from '@nestjs/common';
import { IAuthRepository } from '../../../src/data/repositories/auth.repository';
import { IRabbitmqConsumer } from 'building-blocks/rabbitmq/rabbitmq-subscriber';
import { IRabbitmqPublisher } from 'building-blocks/rabbitmq/rabbitmq-publisher';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IRabbitmqConnection } from 'building-blocks/rabbitmq/rabbitmq-connection';
import { StartedTestContainer } from 'testcontainers';
export declare class Fixture {
    userRepository: IUserRepository;
    authRepository: IAuthRepository;
    postgresContainer: StartedTestContainer;
    rabbitmqContainer: StartedTestContainer;
    rabbitmqConsumer: IRabbitmqConsumer;
    rabbitmqConnection: IRabbitmqConnection;
    rabbitmqPublisher: IRabbitmqPublisher;
    commandBus: CommandBus;
    queryBus: QueryBus;
    app: INestApplication;
}
export declare class IntegrationTestFixture {
    private fixture;
    initializeFixture(): Promise<Fixture>;
    cleanUp(): Promise<void>;
}
