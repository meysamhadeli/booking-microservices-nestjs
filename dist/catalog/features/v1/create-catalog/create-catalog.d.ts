import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { RabbitmqPublisher } from '../../../../modules/rabbitmq/rabbitmqPublisher';
import { CatalogDto } from '../../../dtos/catalog.dto';
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
    constructor(rabbitmqPublisher: RabbitmqPublisher);
    execute(command: CreateCatalog): Promise<CatalogDto>;
}
