import 'reflect-metadata';
import {Fixture, IntegrationTestFixture} from "../../../shared/fixtures/integration-test.fixture";
import {FakeCreateUser} from "../../../shared/fakes/user/fake-create-user";
import {UserCreated} from "building-blocks/contracts/identity.contract";

describe('integration test for create user', () => {
  const integrationTestFixture = new IntegrationTestFixture();
  let fixture: Fixture;

  beforeAll(async () => {
    fixture = await integrationTestFixture.initializeFixture();
  });

  afterAll(async () => {
    await integrationTestFixture.cleanUp();
  });

  it('should create user and retrieve a user from the database', async () => {
    const result = await fixture.commandBus.execute(FakeCreateUser.generate());

    const isPublished = await fixture.rabbitmqPublisher.isPublished(new UserCreated());
    expect(isPublished).toBe(true);

    const user = fixture.userRepository.findUserById(result.id);
    expect(user).not.toBeNull();
  });
});
