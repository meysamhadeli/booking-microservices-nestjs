"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeCreateUser = void 0;
const faker_1 = require("@faker-js/faker");
const role_enum_1 = require("../../../../src/user/enums/role.enum");
const create_user_1 = require("../../../../src/user/features/v1/create-user/create-user");
class FakeCreateUser {
    static generate(user) {
        const createUser = new create_user_1.CreateUser({
            name: user?.name ?? faker_1.faker.person.fullName(),
            role: user?.role ?? role_enum_1.Role.USER,
            password: user?.password ?? 'Admin@1234',
            email: user?.email ?? faker_1.faker.internet.email(),
            passportNumber: user?.passportNumber ?? faker_1.faker.string.numeric(9)
        });
        return createUser;
    }
}
exports.FakeCreateUser = FakeCreateUser;
