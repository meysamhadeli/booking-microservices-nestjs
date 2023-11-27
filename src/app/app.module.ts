import { Module } from '@nestjs/common';
import { OpenTelemetryModule } from '../modules/openTelemetry/open-telemetry.module';
import { RabbitmqModule } from '../modules/rabbitmq/rabbitmq.module';
import { RouterModule } from '@nestjs/core';
import { CatalogModule } from '../catalog/catalog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresOptions } from '../data/data-source';

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
