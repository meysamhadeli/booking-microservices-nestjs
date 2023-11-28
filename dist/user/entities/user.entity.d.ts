import { Role } from '../enums/role.enum';
import { Token } from '../../auth/entities/token.entity';
export declare class User {
    id: number;
    email: string;
    name: string;
    password: string;
    isEmailVerified: boolean;
    role: Role;
    passportNumber: string;
    createdAt: Date;
    updatedAt?: Date | null;
    tokens: Token[];
    constructor(partial?: Partial<User>);
}
