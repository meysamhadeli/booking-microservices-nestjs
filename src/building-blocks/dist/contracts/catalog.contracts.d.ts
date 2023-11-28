import { IEvent } from '@nestjs/cqrs';
export declare class CatalogCreated implements IEvent {
    id: number;
    price: number;
    name: string;
    constructor(partial?: Partial<CatalogCreated>);
}
