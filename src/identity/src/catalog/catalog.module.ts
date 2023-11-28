import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
    CatalogController,
    CreateCatalogHandler,
} from './features/v1/create-catalog/create-catalog';
import { RabbitmqModule } from '../modules/rabbitmq/rabbitmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalog } from './entities/catalog.entity';

@Module({
    imports: [CqrsModule, RabbitmqModule, TypeOrmModule.forFeature([Catalog])],
    controllers: [CatalogController],
    providers: [CreateCatalogHandler],
    exports: [],
})
export class CatalogModule {}
