import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { Catalog } from '../../../entities/catalog.entity';
import { RabbitmqPublisher } from '../../../../modules/rabbitmq/rabbitmq-publisher';
import { CatalogDto } from '../../../dtos/catalog.dto';
import { Repository } from 'typeorm';
export declare class CreateCatalogDto {
    name: string;
    price: number;
    constructor(request?: Partial<CreateCatalogDto>);
}
export declare class CreateCatalog {
    name: string;
    price: number;
    constructor(request?: Partial<CreateCatalog>);
}
export declare class CatalogController {
    private readonly commandBus;
    constructor(commandBus: CommandBus);
    CatalogBrandsAsync(): Promise<CatalogDto[]>;
    ExceptionAsync(): Promise<boolean>;
    CreateCatalogAsync(createCatalogDto: CreateCatalogDto): Promise<CatalogDto>;
}
export declare class CreateCatalogHandler implements ICommandHandler<CreateCatalog> {
    private readonly rabbitmqPublisher;
    private readonly catalogRepository;
    constructor(rabbitmqPublisher: RabbitmqPublisher, catalogRepository: Repository<Catalog>);
    execute(command: CreateCatalog): Promise<CatalogDto>;
}
