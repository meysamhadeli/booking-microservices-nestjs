import moment from 'moment';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import {TokenType} from "../../../enums/token-type.enum";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {AuthDto} from "../../../dtos/auth.dto";
import {Inject} from "@nestjs/common";
import {IAuthRepository} from "../../../../data/repositories/auth.repository";
import {Token} from "../../../entities/token.entity";
import configs from "building-blocks/configs/configs";

export class GenerateToken {
  userId: number;

  constructor(request: Partial<GenerateToken> = {}) {
    Object.assign(this, request);
  }
}

const generateTokenValidations = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required()
  })
};

const generateJwtToken = (
  userId: number,
  expires: number,
  type: TokenType,
  secret: string = configs.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires,
    type
  };
  return jwt.sign(payload, secret);
};


@CommandHandler(GenerateToken)
export class GenerateTokenHandler implements ICommandHandler<GenerateToken> {

    constructor(
        @Inject('IAuthRepository') private readonly authRepository: IAuthRepository,
    ) {}

    async execute(command: GenerateToken): Promise<AuthDto> {

    await generateTokenValidations.params.validateAsync(command);

    const accessTokenExpires = moment().add(configs.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateJwtToken(
      command.userId,
      accessTokenExpires.unix(),
      TokenType.ACCESS
    );

    const refreshTokenExpires = moment().add(configs.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateJwtToken(
      command.userId,
      refreshTokenExpires.unix(),
      TokenType.REFRESH
    );

    await this.authRepository.createToken(
      new Token({
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
        type: TokenType.REFRESH,
        blacklisted: false,
        userId: command.userId
      })
    );

    const result = {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate()
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate()
      }
    };

    return new AuthDto(result);
  }
}
