import { faker } from '@faker-js/faker';
import {Role} from "../../../../src/user/enums/role.enum";
import {User} from "../../../../src/user/entities/user.entity";

export class FakeUser {
  static generate(): User {
    const user: User = {
      id: 1,
      name: faker.person.fullName(),
      role: Role.USER,
      password: 'Admin@1234',
      email: faker.internet.email(),
      passportNumber: faker.string.numeric(9),
      isEmailVerified: false,
      createdAt: faker.date.anytime(),
      tokens: []
    };

    return user;
  }
}
