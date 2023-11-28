import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../user/entities/user.entity";
import { Token } from "../auth/entities/token.entity";
import { CreateUserController, CreateUserHandler } from "./features/v1/createUser/create-user";
import { RabbitmqModule } from "building-blocks/src/modules/rabbitmq/rabbitmq.module";
import { UserRepository } from "../data/repositories/user.repository";

@Module({
  imports: [CqrsModule, RabbitmqModule, TypeOrmModule.forFeature([User, Token])],
  controllers: [CreateUserController],
  providers: [CreateUserHandler, {
    provide: 'IUserRepository',
    useClass: UserRepository,
  }],
  exports: [],
})
export class UserModule {}
