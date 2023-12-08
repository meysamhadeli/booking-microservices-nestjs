import {UserDto} from '../../../dtos/user.dto';
import mapper from '../../../mapping';
import Joi from 'joi';
import {Role} from "../../../enums/role.enum";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, HttpStatus, Inject, NotFoundException, Put, Query, Res, UseGuards} from "@nestjs/common";
import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import { Response} from "express";
import {IUserRepository} from "../../../../data/repositories/user.repository";
import {User} from "../../../entities/user.entity";
import {password} from "building-blocks/utils/validation";
import {JwtGuard} from "building-blocks/passport/jwt.guard";
import {IRabbitmqPublisher} from "building-blocks/rabbitmq/rabbitmq-publisher";
import {encryptPassword} from "building-blocks/utils/encryption";
import {UserUpdated} from "building-blocks/contracts/identity.contract";

export class UpdateUser {
    id: number;
    email: string;
    password: string;
    name: string;
    role: Role;
    passportNumber: string;

    constructor(request: Partial<UpdateUser> = {}) {
        Object.assign(this, request);
    }
}

export class UpdateUserRequestDto {
    email: string;
    password: string;
    name: string;
    role: Role;
    passportNumber: string;

    constructor(request: Partial<UpdateUserRequestDto> = {}) {
        Object.assign(this, request);
    }
}

const updateUserValidations = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    passportNumber: Joi.string().required(),
    role: Joi.string().required().valid(Role.USER, Role.ADMIN)
});

@ApiBearerAuth()
@ApiTags('Users')
@Controller({
    path: `/user`,
    version: '1',
})
export class UpdateUserController {

    constructor(private readonly commandBus: CommandBus,) {
    }

    @Put('update')
    @UseGuards(JwtGuard)
    @ApiResponse({status: 204, description: 'NO_CONTENT'})
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    public async updateUser(
        @Query() id: number,
        @Body() request: UpdateUserRequestDto,
        @Res() res: Response
    ): Promise<UserDto> {

        const user = await this.commandBus.execute(new UpdateUser({
            id: id,
            email: request.email,
            password: request.password,
            name: request.name,
            role: request.role,
            passportNumber: request.passportNumber
        }));

        res.status(HttpStatus.NO_CONTENT).send(user);

        return user;
    }
}

@CommandHandler(UpdateUser)
export class UpdateUserHandler implements ICommandHandler <UpdateUser> {

    constructor(
        @Inject('IRabbitmqPublisher') private readonly rabbitmqPublisher: IRabbitmqPublisher,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

    async execute(command: UpdateUser): Promise<UserDto> {

        await updateUserValidations.validateAsync(command);

        const existUser = await this.userRepository.findUserById(command.id);

        if (!existUser) {
            throw new NotFoundException('User not found');
        }

        const userEntity = await this.userRepository.updateUser(
            new User({
                email: command.email,
                name: command.name,
                password: await encryptPassword(command.password),
                role: command.role,
                passportNumber: command.passportNumber,
                isEmailVerified: existUser.isEmailVerified,
                tokens: existUser.tokens,
                createdAt: existUser.createdAt,
                updatedAt: new Date()
            })
        );

        await this.rabbitmqPublisher.publishMessage(new UserUpdated(userEntity));

        const result = mapper.map<User, UserDto>(userEntity, new UserDto());

        return result;
    }
}
