import { IEvent } from './event';
export declare class UserCreated implements IEvent {
    id: number;
    name: string;
    constructor(partial?: Partial<UserCreated>);
}
