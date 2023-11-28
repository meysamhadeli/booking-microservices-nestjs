import { TokenType } from "../enums/token-type.enum";
import { User } from "../../user/entities/user.entity";
export declare class Token {
    id: number;
    token: string;
    expires: Date;
    type: TokenType;
    blacklisted: boolean;
    createdAt: Date;
    user?: User;
    userId: number;
    constructor(partial?: Partial<Token>);
}
