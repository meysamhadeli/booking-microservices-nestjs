import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from "../user/entities/user.entity";
import {CreateUserController, CreateUserHandler} from "./features/v1/createUser/create-user";
import {RabbitmqModule} from "building-blocks/src/modules/rabbitmq/rabbitmq.module";
import {UserRepository} from "../data/repositories/user.repository";
import {
  DeleteUserByIdController,
  DeleteUserByIdHandler
} from "./features/v1/deleteUserById/delete-user-by-id";
import {UpdateUserController, UpdateUserHandler} from "./features/v1/updateUser/updateUser";
import {GetUsersController, GetUsersHandler} from "./features/v1/getUsers/getUsers";
import {GetUserByIdController, GetUserByIdHandler} from "./features/v1/getUserById/getUserById";
import {Token} from "../auth/entities/token.entity";
import {AuthRepository} from "../data/repositories/auth.repository";

@Module({
  imports: [CqrsModule, RabbitmqModule, TypeOrmModule.forFeature([User, Token])],
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
