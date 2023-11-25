export class CatalogDto {
    id: number;
    price: number;
    name: string;

    constructor(partial?: Partial<CatalogDto>) {
        Object.assign(this, partial);
    }
}
