import { User } from '../../../../src/user/entities/user.entity';
import { CreateUser } from '../../../../src/user/features/v1/create-user/create-user';
export declare class FakeCreateUser {
    static generate(user?: User): CreateUser;
}
