import { IEvent } from '@nestjs/cqrs';

export class CatalogCreated implements IEvent {
    id: number;
    price: number;
    name: string;

    constructor(partial?: Partial<CatalogCreated>) {
        Object.assign(this, partial);
    }
}
