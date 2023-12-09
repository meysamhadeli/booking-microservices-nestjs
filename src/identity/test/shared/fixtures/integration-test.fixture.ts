import {IUserRepository} from "../../../src/data/repositories/user.repository";
import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {PostgresContainer} from "building-blocks/test/container/postgres/postgres-container";
import {RabbitmqContainer} from "building-blocks/test/container/rabbitmq/rabbitmq-container";
import {StartedTestContainer} from "testcontainers";
import {IAuthRepository} from "../../../src/data/repositories/auth.repository";
import {RabbitmqConnection} from "building-blocks/rabbitmq/rabbitmq-connection";
import {IRabbitmqConsumer} from "building-blocks/rabbitmq/rabbitmq-subscriber";
import {IRabbitmqPublisher} from "building-blocks/rabbitmq/rabbitmq-publisher";
import {AppModule} from "../../../src/app.module";
import {CommandBus, QueryBus} from "@nestjs/cqrs";

export class Fixture {
  rabbitMQConnection: RabbitmqConnection;
  userRepository: IUserRepository;
  authRepository: IAuthRepository;
  postgresContainer: StartedTestContainer;
  rabbitmqContainer: StartedTestContainer;
  rabbitmqConsumer: IRabbitmqConsumer;
  rabbitmqPublisher: IRabbitmqPublisher;
  commandBus: CommandBus;
  queryBus: QueryBus;
  app: INestApplication;
}

export class IntegrationTestFixture {
  private fixture: Fixture = new Fixture();

  public async initilizeFixture(): Promise<Fixture> {

    this.fixture.postgresContainer = await new PostgresContainer().start();
    this.fixture.rabbitmqContainer = await new RabbitmqContainer().start();


    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.fixture.app = module.createNestApplication();
    await this.fixture.app.init();

    this.fixture.commandBus = module.get('CommandBus');
    this.fixture.queryBus = module.get('QueryBus');

    this.fixture.userRepository = module.get('IUserRepository');
    this.fixture.authRepository = module.get('IAuthRepository');
    this.fixture.rabbitMQConnection = module.get('RabbitmqConnection');

    this.fixture.rabbitmqPublisher = module.get('IRabbitmqPublisher');
    this.fixture.rabbitmqConsumer = module.get('IRabbitmqConsumer');

    return this.fixture;
  }

  public async cleanUp() {
    await this.fixture.rabbitmqContainer.stop();
    await this.fixture.postgresContainer.stop();

    await this.fixture.app.close();
  }
}
