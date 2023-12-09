import { UserCreated } from 'building-blocks/contracts/identity.contract';
import { faker } from '@faker-js/faker';
import * as TypeMoq from 'typemoq';
import {FakeUser} from "../../../shared/fakes/user/fake-user.entity";
import {User} from "../../../../src/user/entities/user.entity";
import {IUserRepository} from "../../../../src/data/repositories/user.repository";
import {UserDto} from "../../../../src/user/dtos/user.dto";
import {FakeCreateUser} from "../../../shared/fakes/user/fake-create-user";
import {IRabbitmqPublisher} from "building-blocks/rabbitmq/rabbitmq-publisher";
import {CreateUserHandler} from "../../../../src/user/features/v1/createUser/create-user";

describe('unit test for create user', () => {
  let createUserHandler: CreateUserHandler;

  const fakeUser: User = FakeUser.generate();

  const mockUserRepository: TypeMoq.IMock<IUserRepository> = TypeMoq.Mock.ofType<IUserRepository>();
  const mockPublisher: TypeMoq.IMock<IRabbitmqPublisher> = TypeMoq.Mock.ofType<IRabbitmqPublisher>();

  beforeEach(() => {
    createUserHandler = new CreateUserHandler(mockPublisher.object, mockUserRepository.object);
  });

  it('should create a user and retrieve a valid data', async () => {
    const email = faker.internet.email();

    mockUserRepository
      .setup((x) => x.findUserByEmail(TypeMoq.It.isAnyString()))
      .returns(() => null);

    // Mock userRepository's behavior when creating a user
    mockUserRepository
      .setup((x) => x.createUser(TypeMoq.It.isAnyObject(User)))
      .returns(() => Promise.resolve(fakeUser));

    // Mock publisher's behavior when publishing a user created
    mockPublisher
      .setup((x) => x.publishMessage(TypeMoq.It.isAnyObject(UserCreated)))
      .returns(() => Promise.resolve());

    const result: UserDto = await createUserHandler.execute(FakeCreateUser.generate(fakeUser));

    // Verify that the publishMessage method was called exactly once
    mockUserRepository.verify(
      (x) => x.findUserByEmail(TypeMoq.It.isAnyString()),
      TypeMoq.Times.once()
    );
    mockPublisher.verify(
      (x) => x.publishMessage(TypeMoq.It.isAnyObject(UserCreated)),
      TypeMoq.Times.once()
    );

    mockUserRepository.verify(
      (x) => x.createUser(TypeMoq.It.isAnyObject(User)),
      TypeMoq.Times.once()
    );
    expect(result).not.toBeNull();
  });
});
