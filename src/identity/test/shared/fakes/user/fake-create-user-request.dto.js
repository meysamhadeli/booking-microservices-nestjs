"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeCreateUserRequestDto = void 0;
const openapi = require("@nestjs/swagger");
const faker_1 = require("@faker-js/faker");
const role_enum_1 = require("../../../../src/user/enums/role.enum");
class FakeCreateUserRequestDto {
    static generate() {
        const createUserRequestDto = {
            email: faker_1.faker.internet.email(),
            password: 'Admin@1234',
            name: faker_1.faker.person.fullName(),
            role: role_enum_1.Role.USER,
            passportNumber: faker_1.faker.string.numeric(9)
        };
        return createUserRequestDto;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.FakeCreateUserRequestDto = FakeCreateUserRequestDto;
