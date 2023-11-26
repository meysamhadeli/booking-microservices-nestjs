import { Module } from '@nestjs/common';
import { OpenTelemetryModule } from '../modules/openTelemetry/open-telemetry.module';
import { RabbitmqModule } from '../modules/rabbitmq/rabbitmq.module';
import { RouterModule } from '@nestjs/core';
import { CatalogModule } from '../catalog/catalog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config/config';

@Module({
    imports: [
        OpenTelemetryModule,
        RabbitmqModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: config.postgres.host,
            port: config.postgres.port,
            username: config.postgres.username,
            password: config.postgres.password,
            database: config.postgres.database,
            autoLoadEntities: config.postgres.autoLoadEntities,
            synchronize: config.postgres.synchronize,
        }),
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
