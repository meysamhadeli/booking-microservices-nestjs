import { IEvent } from './event';

export class UserCreated implements IEvent {
    id: number;
    name: string;

    constructor(partial?: Partial<UserCreated>) {
        Object.assign(this, partial);
    }
}
