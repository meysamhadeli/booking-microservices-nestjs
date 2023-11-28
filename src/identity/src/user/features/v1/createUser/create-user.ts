import { UserDto } from '../../../dtos/user.dto';
import mapper from '../../../mapping';
import { Role } from "../../../enums/role.enum";
import { ApiBearerAuth, ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  Body,
  ConflictException,
  Controller,
  HttpStatus, Inject,
  Post
} from "@nestjs/common";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "../../../entities/user.entity";
import { UserCreated } from "../../../../../../building-blocks/src/contracts/identityContract";
import { IUserRepository } from "../../../../data/repositories/user.repository";
import { RabbitmqPublisher } from "building-blocks/src/modules/rabbitmq/rabbitmq-publisher";
import { encryptPassword } from "building-blocks/src/utils/encryption";
import Joi from "joi";
import { password } from "building-blocks/src/utils/validation";

export class CreateUser {
  email: string;
  password: string;
  name: string;
  role: Role;
  passportNumber: string;

  constructor(request: Partial<CreateUser> = {}) {
    Object.assign(this, request);
  }
}

export class CreateUserRequestDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  passportNumber: string;

  constructor(request: Partial<CreateUserRequestDto> = {}) {
    Object.assign(this, request);
  }
}


@ApiBearerAuth()
@ApiTags('Users')
@Controller({
  path: `/user`,
  version: '1',
})
export class CreateUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('create')
  @ApiResponse({ status: 401, description: HttpStatus.FORBIDDEN.toString() })
  @ApiResponse({
    status: 201,
    description: HttpStatus.CREATED.toString()
  })
  public async createUser(@Body() request: CreateUserRequestDto): Promise<UserDto> {

    return this.commandBus.execute( new CreateUser({
      email: request.email,
      password: request.password,
      name: request.name,
      role: request.role,
      passportNumber: request.passportNumber
    }));
  }
}


@CommandHandler(CreateUser)
export class CreateUserHandler implements ICommandHandler<CreateUser> {
  constructor(
    private readonly rabbitmqPublisher: RabbitmqPublisher,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: CreateUser): Promise<UserDto> {


    const createUserValidations = Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      name: Joi.string().required(),
      passportNumber: Joi.string().required(),
      role: Joi.string().required().valid(Role.USER, Role.ADMIN)
    });

   await createUserValidations.validateAsync(command);

    const existUser = await this.userRepository.findUserByEmail(command.email);

    if (existUser) {
      throw new ConflictException('Email already taken');
    }

    const userEntity = await this.userRepository.createUser(
      new User({
        email: command.email,
        name: command.name,
        password: await encryptPassword(command.password),
        role: command.role,
        passportNumber: command.passportNumber,
        isEmailVerified: false
      })
    );

    await this.rabbitmqPublisher.publishMessage(new UserCreated(userEntity));

    const result = mapper.map<User, UserDto>(userEntity, new UserDto());

    return result;
  }
}
