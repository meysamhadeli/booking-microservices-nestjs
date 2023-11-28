import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Token} from "../auth/entities/token.entity";
import {RabbitmqModule} from "building-blocks/src/modules/rabbitmq/rabbitmq.module";
import {AuthRepository} from "../data/repositories/auth.repository";
import {LoginController, LoginHandler} from "./features/v1/login/login";
import {LogoutController, LogoutHandler} from "./features/v1/logout/logout";
import {RefreshTokenController, RefreshTokenHandler} from "./features/v1/refreshToken/refreshToken";
import {GenerateTokenHandler} from "./features/v1/generateToken/generateToken";
import {ValidateTokenHandler} from "./features/v1/validateToken/validateToken";
import {User} from "../user/entities/user.entity";
import {UserRepository} from "../data/repositories/user.repository";

@Module({
    imports: [CqrsModule, RabbitmqModule, TypeOrmModule.forFeature([Token, User])],
    controllers: [LoginController, LogoutController, RefreshTokenController],
    providers: [LoginHandler, GenerateTokenHandler, LogoutHandler, RefreshTokenHandler, ValidateTokenHandler,
        {
            provide: 'IAuthRepository',
            useClass: AuthRepository,
        },
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        }
    ],
    exports: [],
})
export class AuthModule {
}
