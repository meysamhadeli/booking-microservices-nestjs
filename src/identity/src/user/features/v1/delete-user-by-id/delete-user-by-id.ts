import {UserDto} from '../../../dtos/user.dto';
import Joi from 'joi';
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Controller, Delete, HttpStatus, Inject, NotFoundException, Query, Res, UseGuards} from "@nestjs/common";
import { Response } from 'express';
import {IUserRepository} from "../../../../data/repositories/user.repository";
import {User} from "../../../entities/user.entity";
import {JwtGuard} from "building-blocks/passport/jwt.guard";
import {IRabbitmqPublisher} from "building-blocks/rabbitmq/rabbitmq-publisher";
import {UserDeleted} from "building-blocks/contracts/identity.contract";
import mapper from "../../../mapping";

export class DeleteUserById {
    id: number;

    constructor(request: Partial<DeleteUserById> = {}) {
        Object.assign(this, request);
    }
}

const deleteUserValidations = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    })
};

@ApiBearerAuth()
@ApiTags('Users')
@Controller({
    path: `/user`,
    version: '1',
})
export class DeleteUserByIdController {
    constructor(private readonly commandBus: CommandBus) {
    }

    @Delete('delete')
    @UseGuards(JwtGuard)
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    public async deleteUserById(@Query('id') id: number, @Res() res: Response): Promise<UserDto> {

        const user = await this.commandBus.execute( new DeleteUserById({
            id: id
        }));

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}

@CommandHandler(DeleteUserById)
export class DeleteUserByIdHandler implements ICommandHandler<DeleteUserById> {
    constructor(
        @Inject('IRabbitmqPublisher') private readonly rabbitmqPublisher: IRabbitmqPublisher,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    ) {}

    async execute(command: DeleteUserById): Promise<UserDto> {
        await deleteUserValidations.params.validateAsync(command);

        const user = await this.userRepository.findUserById(command.id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userEntity = await this.userRepository.removeUser(user);

        await this.rabbitmqPublisher.publishMessage(new UserDeleted(userEntity));

        const result = mapper.map<User, UserDto>(userEntity, new UserDto());

        return result;
    }
}
