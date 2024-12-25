"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTestFixture = exports.Fixture = void 0;
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const postgres_container_1 = require("building-blocks/test/container/postgres/postgres-container");
const rabbitmq_container_1 = require("building-blocks/test/container/rabbitmq/rabbitmq-container");
const cqrs_1 = require("@nestjs/cqrs");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const configs_1 = __importDefault(require("building-blocks/configs/configs"));
const open_telemetry_module_1 = require("building-blocks/openTelemetry/open-telemetry.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("../../../src/user/user.module");
const auth_module_1 = require("../../../src/auth/auth.module");
const core_1 = require("@nestjs/core");
const jwt_strategy_1 = require("building-blocks/passport/jwt.strategy");
const jwt_guard_1 = require("building-blocks/passport/jwt.guard");
class Fixture {
    userRepository;
    authRepository;
    postgresContainer;
    rabbitmqContainer;
    rabbitmqConsumer;
    rabbitmqConnection;
    rabbitmqPublisher;
    commandBus;
    queryBus;
    app;
}
exports.Fixture = Fixture;
class IntegrationTestFixture {
    fixture = new Fixture();
    async initializeFixture() {
        const [postgresContainer, postgresOptions] = await new postgres_container_1.PostgresContainer().start();
        this.fixture.postgresContainer = postgresContainer;
        const [rabbitmqContainer, rabbitmqOptions] = await new rabbitmq_container_1.RabbitmqContainer().start();
        this.fixture.rabbitmqContainer = rabbitmqContainer;
        const module = await testing_1.Test.createTestingModule({
            imports: [
                passport_1.PassportModule,
                jwt_1.JwtModule.register({
                    secret: configs_1.default.jwt.secret,
                    signOptions: { expiresIn: configs_1.default.jwt.refreshExpirationDays }
                }),
                open_telemetry_module_1.OpenTelemetryModule.forRoot(),
                typeorm_1.TypeOrmModule.forRootAsync(postgresOptions),
                user_module_1.UserModule,
                auth_module_1.AuthModule,
                core_1.RouterModule.register([
                    {
                        path: '/',
                        module: user_module_1.UserModule
                    },
                    {
                        path: '/',
                        module: auth_module_1.AuthModule
                    }
                ])
            ],
            providers: [jwt_strategy_1.JwtStrategy, cqrs_1.CommandBus, cqrs_1.QueryBus]
        })
            .overrideGuard(jwt_guard_1.JwtGuard)
            .useValue({
            canActivate: (context) => {
                const req = context.switchToHttp().getRequest();
                req.user = { userId: 1, username: 'test_user' };
                return true;
            }
        })
            .compile();
        this.fixture.app = module.createNestApplication();
        this.fixture.app.setGlobalPrefix('api');
        this.fixture.app.enableVersioning({
            type: common_1.VersioningType.URI
        });
        await this.fixture.app.init();
        this.fixture.userRepository = module.get('IUserRepository');
        this.fixture.authRepository = module.get('IAuthRepository');
        this.fixture.rabbitmqPublisher = module.get('IRabbitmqPublisher');
        this.fixture.rabbitmqConnection = module.get('IRabbitmqConnection');
        this.fixture.commandBus = module.get(cqrs_1.CommandBus);
        this.fixture.queryBus = module.get(cqrs_1.QueryBus);
        return this.fixture;
    }
    async cleanUp() {
        await this.fixture.rabbitmqContainer.stop();
        await this.fixture.postgresContainer.stop();
        await this.fixture.app.close();
    }
}
exports.IntegrationTestFixture = IntegrationTestFixture;
