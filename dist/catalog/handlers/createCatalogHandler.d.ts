import { ICommandHandler } from '@nestjs/cqrs';
import { CreateCatalogCommand } from '../commands/create-catalog.command';
export declare class CreateCatalogHandler implements ICommandHandler<CreateCatalogCommand> {
    execute(command: CreateCatalogCommand): Promise<boolean>;
}
