import { faker } from '@faker-js/faker';
import { User } from '@/user/entities/user.entity';
import { Role } from '@/user/enums/role.enum';
import { CreateUser } from '@/user/features/v1/create-user/create-user';

export class FakeCreateUser {
  static generate(user?: User): CreateUser {
    const createUser = new CreateUser({
      name: user?.name ?? faker.person.fullName(),
      role: user?.role ?? Role.USER,
      password: user?.password ?? 'Admin@1234',
      email: user?.email ?? faker.internet.email(),
      passportNumber: user?.passportNumber ?? faker.string.numeric(9)
    });

    return createUser;
  }
}
