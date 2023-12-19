import Joi from 'joi';
import {GenerateToken} from '../generate-token/generate-token';
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Inject, Post, Query, UnauthorizedException} from "@nestjs/common";
import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {AuthDto} from "../../../dtos/auth.dto";
import {IAuthRepository} from "../../../../data/repositories/auth.repository";
import {IUserRepository} from "../../../../data/repositories/user.repository";
import {TokenType} from "../../../enums/token-type.enum";
import {ValidateToken} from "../validate-token/validate-token";

export class RefreshToken {
    refreshToken: string;

    constructor(request: Partial<RefreshToken> = {}) {
        Object.assign(this, request);
    }
}

const refreshTokenValidations = {
    params: Joi.object().keys({
        refreshToken: Joi.string().required()
    })
};

@ApiBearerAuth()
@ApiTags('Identities')
@Controller({
    path: `/identity`,
    version: '1',
})
export class RefreshTokenController {

    constructor(private readonly commandBus: CommandBus) {
    }

    @Post('refresh-token')
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    @ApiResponse({status: 200, description: 'OK'})
    public async refreshToken(@Body('refreshToken') refreshToken: string): Promise<AuthDto> {
        const result = await this.commandBus.execute(new RefreshToken({refreshToken: refreshToken}));

        return result;
    }
}

@CommandHandler(RefreshToken)
export class RefreshTokenHandler implements ICommandHandler<RefreshToken> {
    constructor(
        @Inject('IAuthRepository') private readonly authRepository: IAuthRepository,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        private readonly commandBus: CommandBus
    ) {
    }

    async execute(command: RefreshToken): Promise<AuthDto> {

        await refreshTokenValidations.params.validateAsync(command);

        try {
            const refreshTokenData = await this.commandBus.execute(
                new ValidateToken({
                    token: command.refreshToken,
                    type: TokenType.REFRESH
                })
            );
            const {userId} = refreshTokenData;

            await this.authRepository.removeToken(refreshTokenData);

            const result = await this.commandBus.execute(new GenerateToken({userId: userId}));

            return result;
        } catch (error) {
            throw new UnauthorizedException('Please authenticate');
        }
    }
}
