import { IEvent } from "@nestjs/cqrs";

export class UserCreated implements IEvent {
  id: number;
  email: string;
  name: string;
  isEmailVerified: boolean;
  role: Role;
  passportNumber: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(partial?: Partial<UserCreated>) {
    Object.assign(this, partial);
  }
}

export class UserDeleted implements IEvent {
  id: number;
  email: string;
  name: string;
  isEmailVerified: boolean;
  role: Role;
  passportNumber: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(partial?: Partial<UserDeleted>) {
    Object.assign(this, partial);
  }
}

export class UserUpdated implements IEvent {
  id: number;
  email: string;
  name: string;
  isEmailVerified: boolean;
  role: Role;
  passportNumber: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(partial?: Partial<UserUpdated>) {
    Object.assign(this, partial);
  }
}

export enum Role {
  USER = 0,
  ADMIN = 1
}
