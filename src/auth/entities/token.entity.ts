import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TokenType } from "../enums/token-type.enum";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    expires: Date;

    @Column()
    type: TokenType;

    @Column()
    blacklisted: boolean;

    @Column()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.tokens)
    user?: User;

    @Column()
    userId: number;

    constructor(partial?: Partial<Token>) {
        Object.assign(this, partial);
        this.createdAt = partial?.createdAt ?? new Date();
    }
}
