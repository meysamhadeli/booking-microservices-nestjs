"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const end_to_end_fixture_1 = require("../../../shared/fixtures/end-to-end.fixture");
const fake_create_user_request_dto_1 = require("../../../shared/fakes/user/fake-create-user-request.dto");
const request = require('supertest');
describe('end-to-end test for create user', () => {
    const endToEndFixture = new end_to_end_fixture_1.EndToEndTestFixture();
    let fixture;
    beforeAll(async () => {
        fixture = await endToEndFixture.initializeFixture();
    });
    afterAll(async () => {
        await endToEndFixture.cleanUp();
    });
    it('should create user and retrieve 201 status code', async () => {
        const createUserResponse = await request(fixture.app.getHttpServer())
            .post('/api/v1/user/create')
            .send(fake_create_user_request_dto_1.FakeCreateUserRequestDto.generate())
            .expect(201);
    });
});
//# sourceMappingURL=create-user.test.js.map