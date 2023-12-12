import Joi from 'joi';
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, HttpStatus, Inject, NotFoundException, Param, Post, Query, Res} from "@nestjs/common";
import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Response} from "express";
import {IAuthRepository} from "../../../../data/repositories/auth.repository";
import {IUserRepository} from "../../../../data/repositories/user.repository";
import {TokenType} from "../../../enums/token-type.enum";

export class Logout {
    accessToken: string;

    constructor(request: Partial<Logout> = {}) {
        Object.assign(this, request);
    }
}

const logoutValidations = {
    params: Joi.object().keys({
        accessToken: Joi.string().required()
    })
};

@ApiBearerAuth()
@ApiTags('Identities')
@Controller({
    path: `/identity`,
    version: '1',
})
export class LogoutController {

    constructor(private readonly commandBus: CommandBus) {
    }

    @Post('logout')
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    @ApiResponse({status: 204, description: 'NO_CONTENT'})
    public async logout(@Query('accessToken') accessToken: string, @Res() res: Response): Promise<void> {

        await this.commandBus.execute(new Logout({accessToken: accessToken}));

        res.status(HttpStatus.NO_CONTENT).send(null);
    }
}

@CommandHandler(Logout)
export class LogoutHandler implements ICommandHandler<Logout> {

    constructor(
        @Inject('IAuthRepository') private readonly authRepository: IAuthRepository,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository
    ) {
    }

    async execute(command: Logout): Promise<number> {

        await logoutValidations.params.validateAsync(command);

        const token = await this.authRepository.findToken(command.accessToken, TokenType.ACCESS);

        if (!token) {
            throw new NotFoundException('Access Token Not found');
        }

        const tokenEntity = await this.authRepository.removeToken(token);

        return tokenEntity?.userId;
    }
}
