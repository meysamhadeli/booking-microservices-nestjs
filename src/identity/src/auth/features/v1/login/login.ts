import Joi from 'joi';
import {GenerateToken} from '../generateToken/generate-token';
import {ApiBearerAuth, ApiProperty, ApiResponse, ApiTags} from "@nestjs/swagger";
import {password} from "building-blocks/dist/utils/validation";
import {Body, Controller, Get, HttpStatus, Inject, Post, UseGuards} from "@nestjs/common";
import {AuthDto} from "../../../dtos/auth.dto";
import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {IAuthRepository} from "../../../../data/repositories/auth.repository";
import {isPasswordMatch} from "building-blocks/dist/utils/encryption";
import {IUserRepository} from "../../../../data/repositories/user.repository";
import ApplicationException from "building-blocks/dist/types/exeptions/application.exception";

export class Login {
    email: string;
    password: string;

    constructor(request: Partial<Login> = {}) {
        Object.assign(this, request);
    }
}

export class LoginRequestDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    constructor(request: Partial<LoginRequestDto> = {}) {
        Object.assign(this, request);
    }
}

const loginValidations = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(password)
});

@ApiBearerAuth()
@ApiTags('Identities')
@Controller({
    path: `/identity`,
    version: '1',
})
export class LoginController {

    constructor(private readonly commandBus: CommandBus) {
    }

    @Post('login')
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    @ApiResponse({status: 200, description: 'OK'})
    public async login(@Body() request: LoginRequestDto): Promise<AuthDto> {

        const result = await this.commandBus.execute(new Login(request));

        return result;
    }
}



@CommandHandler(Login)
export class LoginHandler implements ICommandHandler<Login> {

    constructor(
        @Inject('IAuthRepository') private readonly authRepository: IAuthRepository,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        private readonly commandBus: CommandBus
    ) {}

    async execute(command: Login): Promise<AuthDto> {

        await loginValidations.validateAsync(command);

        const user = await this.userRepository.findUserByEmail(command.email);

        if (!user || !(await isPasswordMatch(command.password, user.password as string))) {
            throw new ApplicationException('Incorrect email or password');
        }

        const token = await this.commandBus.execute(new GenerateToken({userId: user.id}));

        return token;
    }
}
