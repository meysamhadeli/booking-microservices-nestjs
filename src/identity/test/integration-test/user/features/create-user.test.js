"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const integration_test_fixture_1 = require("../../../shared/fixtures/integration-test.fixture");
const fake_create_user_1 = require("../../../shared/fakes/user/fake-create-user");
const identity_contract_1 = require("building-blocks/contracts/identity.contract");
describe('integration test for create user', () => {
    const integrationTestFixture = new integration_test_fixture_1.IntegrationTestFixture();
    let fixture;
    beforeAll(async () => {
        fixture = await integrationTestFixture.initializeFixture();
    });
    afterAll(async () => {
        await integrationTestFixture.cleanUp();
    });
    it('should create user and retrieve a user from the database', async () => {
        const result = await fixture.commandBus.execute(fake_create_user_1.FakeCreateUser.generate());
        const isPublished = await fixture.rabbitmqPublisher.isPublished(new identity_contract_1.UserCreated());
        expect(isPublished).toBe(true);
        const user = fixture.userRepository.findUserById(result.id);
        expect(user).not.toBeNull();
    });
});
