import Joi from 'joi';
import jwt from 'jsonwebtoken';
import {TokenType} from "../../../enums/token-type.enum";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Inject, NotFoundException} from "@nestjs/common";
import {IAuthRepository} from "../../../../data/repositories/auth.repository";
import {IUserRepository} from "../../../../data/repositories/user.repository";
import {Token} from "../../../entities/token.entity";
import configs from "building-blocks/configs/configs";

export class ValidateToken {
  token: string;
  type: TokenType;

  constructor(request: Partial<ValidateToken> = {}) {
    Object.assign(this, request);
  }
}

const validateTokenValidations = Joi.object({
  token: Joi.string().required(),
  type: Joi.string().required().valid(TokenType.ACCESS, TokenType.REFRESH)
});

@CommandHandler(ValidateToken)
export class ValidateTokenHandler implements ICommandHandler<ValidateToken> {
    constructor(
        @Inject('IAuthRepository') private readonly authRepository: IAuthRepository,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository
    ) {
    }

    async execute(command: ValidateToken): Promise<Token> {

    await validateTokenValidations.validateAsync(command);

    const payload = jwt.verify(command.token, configs.jwt.secret);
    const userId = Number(payload.sub);

    const tokenEntity = await this.authRepository.findTokenByUserId(
        command.token,
        command.type,
      userId,
      false
    );

    if (!tokenEntity) {
      throw new NotFoundException('Token not found');
    }

    return tokenEntity;
  }
}
