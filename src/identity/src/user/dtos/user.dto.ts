import { Role } from "../enums/role.enum";

export class UserDto {
  id: number;
  email: string;
  name: string;
  isEmailVerified: boolean;
  role: Role;
  passportNumber: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(request: Partial<UserDto> = {}) {
    Object.assign(this, request);
  }
}
