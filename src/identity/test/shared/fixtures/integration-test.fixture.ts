import {IUserRepository} from "../../../src/data/repositories/user.repository";
import {ExecutionContext, INestApplication, VersioningType} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {PostgresContainer} from "building-blocks/test/container/postgres/postgres-container";
import {RabbitmqContainer} from "building-blocks/test/container/rabbitmq/rabbitmq-container";
import {IAuthRepository} from "../../../src/data/repositories/auth.repository";
import {IRabbitmqConsumer} from "building-blocks/rabbitmq/rabbitmq-subscriber";
import {IRabbitmqPublisher} from "building-blocks/rabbitmq/rabbitmq-publisher";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import configs from "building-blocks/configs/configs";
import {OpenTelemetryModule} from "building-blocks/openTelemetry/open-telemetry.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModule} from "../../../src/user/user.module";
import {AuthModule} from "../../../src/auth/auth.module";
import {RouterModule} from "@nestjs/core";
import {JwtStrategy} from "building-blocks/passport/jwt.strategy";
import {JwtGuard} from "building-blocks/passport/jwt.guard";
import {IRabbitmqConnection} from "building-blocks/rabbitmq/rabbitmq-connection";
import {StartedTestContainer} from "testcontainers";

export class Fixture {
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

export class IntegrationTestFixture {
  private fixture: Fixture = new Fixture();

  public async initializeFixture(): Promise<Fixture> {

    const [postgresContainer, postgresOptions] = await new PostgresContainer().start();
    this.fixture.postgresContainer = postgresContainer;

    const [rabbitmqContainer, rabbitmqOptions] = await new RabbitmqContainer().start();
    this.fixture.rabbitmqContainer = rabbitmqContainer;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: configs.jwt.secret,
          signOptions: {expiresIn: configs.jwt.refreshExpirationDays},
        }),
        OpenTelemetryModule,
        TypeOrmModule.forRoot(postgresOptions),
        UserModule,
        AuthModule,
        RouterModule.register([
          {
            path: '/',
            module: UserModule,
          },
          {
            path: '/',
            module: AuthModule,
          },
        ]),
      ],
      providers: [JwtStrategy, CommandBus, QueryBus],
    }).overrideGuard(JwtGuard)
        .useValue({
          canActivate: (context: ExecutionContext) => {
            const req = context.switchToHttp().getRequest();
            req.user = { userId: 1, username: 'test_user' };
            return true;
          },
        })
        .compile()

    this.fixture.app = module.createNestApplication();

    this.fixture.app.setGlobalPrefix('api');

    this.fixture.app.enableVersioning({
      type: VersioningType.URI,
    });

    await this.fixture.app.init();

    this.fixture.userRepository = module.get<IUserRepository>('IUserRepository');
    this.fixture.authRepository = module.get<IAuthRepository>('IAuthRepository');

    this.fixture.rabbitmqPublisher = module.get<IRabbitmqPublisher>('IRabbitmqPublisher');
    this.fixture.rabbitmqConnection = module.get<IRabbitmqConnection>('IRabbitmqConnection');

    this.fixture.commandBus = module.get<CommandBus>(CommandBus);
    this.fixture.queryBus = module.get<QueryBus>(QueryBus);

    return this.fixture;
  }

  public async cleanUp() {

    await this.fixture.rabbitmqContainer.stop();
    await this.fixture.postgresContainer.stop();

    await this.fixture.app.close();
  }
}
