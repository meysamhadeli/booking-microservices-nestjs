import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
    CatalogController,
    CreateCatalogHandler,
} from './features/v1/create-catalog/create-catalog';
import { RabbitmqModule } from "../modules/rabbitmq/rabbitmq.module";

@Module({
    imports: [CqrsModule, RabbitmqModule],
    controllers: [CatalogController],
    providers: [CreateCatalogHandler],
    exports: [],
})
export class CatalogModule {}
