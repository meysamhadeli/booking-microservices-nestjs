import { IEvent } from "@nestjs/cqrs";
export declare class UserCreated implements IEvent {
    id: number;
    email: string;
    name: string;
    isEmailVerified: boolean;
    role: Role;
    passportNumber: string;
    createdAt: Date;
    updatedAt?: Date;
    constructor(partial?: Partial<UserCreated>);
}
export declare class UserDeleted implements IEvent {
    id: number;
    email: string;
    name: string;
    isEmailVerified: boolean;
    role: Role;
    passportNumber: string;
    createdAt: Date;
    updatedAt?: Date;
    constructor(partial?: Partial<UserDeleted>);
}
export declare class UserUpdated implements IEvent {
    id: number;
    email: string;
    name: string;
    isEmailVerified: boolean;
    role: Role;
    passportNumber: string;
    createdAt: Date;
    updatedAt?: Date;
    constructor(partial?: Partial<UserUpdated>);
}
export declare enum Role {
    USER = 0,
    ADMIN = 1
}
