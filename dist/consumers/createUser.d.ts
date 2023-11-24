import { UserCreated } from '../events/userCreated';
export declare const createUserConsumerHandler: (queue: string, message: UserCreated) => Promise<void>;
