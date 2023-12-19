import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from "../user/entities/user.entity";
import {CreateUserController, CreateUserHandler} from "./features/v1/create-user/create-user";
import {UserRepository} from "../data/repositories/user.repository";
import {
  DeleteUserByIdController,
  DeleteUserByIdHandler
} from "./features/v1/delete-user-by-id/delete-user-by-id";
import {UpdateUserController, UpdateUserHandler} from "./features/v1/update-user/update-user";
import {GetUsersController, GetUsersHandler} from "./features/v1/get-users/get-users";
import {GetUserByIdController, GetUserByIdHandler} from "./features/v1/get-user-by-id/get-user-by-id";
import {Token} from "../auth/entities/token.entity";
import {AuthRepository} from "../data/repositories/auth.repository";
import {RabbitmqModule} from "building-blocks/rabbitmq/rabbitmq.module";
import {RabbitmqOptions} from "building-blocks/rabbitmq/rabbitmq-connection";

@Module({
  imports: [CqrsModule, RabbitmqModule.forRoot(), TypeOrmModule.forFeature([User, Token])],
  controllers: [CreateUserController, DeleteUserByIdController, UpdateUserController, GetUsersController, GetUserByIdController],
  providers: [CreateUserHandler, DeleteUserByIdHandler, UpdateUserHandler, GetUsersHandler, GetUserByIdHandler,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    }
    ],
  exports: [],
})

export class UserModule {}