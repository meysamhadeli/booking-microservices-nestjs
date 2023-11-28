// import { Repository } from 'typeorm';
// import { InjectRepository } from "@nestjs/typeorm";
// import { TokenType } from "../../auth/enums/token-type.enum";
// import { Token } from "../../auth/entities/token.entity";
//
// export interface IAuthRepository {
//   createToken(token: Token): Promise<void>;
//
//   findToken(token: string, tokenType: TokenType): Promise<Token>;
//
//   findTokenByUserId(
//     token: string,
//     tokenType: TokenType,
//     userId: number,
//     blacklisted: boolean
//   ): Promise<Token>;
//
//   removeToken(token: Token): Promise<Token>;
// }
//
// export class AuthRepository implements IAuthRepository {
//   constructor(@InjectRepository(Token)
//               private readonly tokenRepository: Repository<Token>) {
//   }
//
//   async createToken(token: Token): Promise<void> {
//     await this.tokenRepository.save(token);
//   }
//
//   async findToken(token: string, tokenType: TokenType): Promise<Token> {
//     return await this.tokenRepository.findOneBy({
//       token: token,
//       type: tokenType
//     });
//   }
//
//   async findTokenByUserId(
//     token: string,
//     tokenType: TokenType,
//     userId: number,
//     blacklisted: boolean
//   ): Promise<Token> {
//     return await this.tokenRepository.findOneBy({
//       token: token,
//       type: tokenType,
//       userId: userId,
//       blacklisted: blacklisted
//     });
//   }
//
//   async removeToken(token: Token): Promise<Token> {
//     return await this.tokenRepository.remove(token);
//   }
// }
