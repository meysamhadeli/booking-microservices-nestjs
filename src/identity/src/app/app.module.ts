import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CatalogModule } from '../catalog/catalog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresOptions } from '../data/data-source';
import { OpenTelemetryModule } from 'building-blocks/dist/modules/openTelemetry/open-telemetry.module';
import { RabbitmqModule } from 'building-blocks/dist/modules/rabbitmq/rabbitmq.module';

@Module({
    imports: [
        OpenTelemetryModule,
        RabbitmqModule,
        TypeOrmModule.forRoot(postgresOptions),
        CatalogModule,
        RouterModule.register([
            {
                path: 'catalogs',
                module: CatalogModule,
            },
        ]),
    ],
    providers: [],
})
export class AppModule {}
