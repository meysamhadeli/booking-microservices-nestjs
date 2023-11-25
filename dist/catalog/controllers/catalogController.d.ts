import { CommandBus } from '@nestjs/cqrs';
import { CreateCatalogCommandDto } from '../commands/createCatalogCommandDto';
import { Catalog } from '../models/catalog';
export declare class CatalogController {
    private commandBus;
    constructor(commandBus: CommandBus);
    CatalogBrandsAsync(): Promise<Catalog[]>;
    ExceptionAsync(): Promise<boolean>;
    CreateCatalogAsync(createCatalogCommand: CreateCatalogCommandDto): Promise<boolean>;
}
