import { CommandBus } from '@nestjs/cqrs';
import { Catalog } from '../enitities/catalog.entity';
import { CreateCatalogDto } from '../dtos/create-catalog.dto';
export declare class CatalogController {
    private commandBus;
    constructor(commandBus: CommandBus);
    CatalogBrandsAsync(): Promise<Catalog[]>;
    ExceptionAsync(): Promise<boolean>;
    CreateCatalogAsync(createCatalogDto: CreateCatalogDto): Promise<boolean>;
}
