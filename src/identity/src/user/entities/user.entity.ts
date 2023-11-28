import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Token } from '../../auth/entities/token.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    isEmailVerified: boolean;

    @Column({
        type: 'enum',
        enum: Role, // Use the Role enum for this column
        default: Role.USER, // Set a default role if needed
    })
    role: Role;

    @Column()
    passportNumber: string;

    @Column()
    createdAt: Date;

    @Column({ nullable: true }) // Making 'updatedAt' nullable
    updatedAt?: Date | null; // You can use 'Date | null' to allow null values

    @OneToMany(() => Token, (token) => token.user)
    tokens: Token[];

    constructor(partial?: Partial<User>) {
        Object.assign(this, partial);
        this.createdAt = partial?.createdAt ?? new Date();
    }
}
