import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CatalogModule } from '../catalog/catalog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresOptions } from '../data/data-source';
import { UserModule } from "../user/user.module";
import { OpenTelemetryModule } from "building-blocks/src/modules/openTelemetry/open-telemetry.module";
import { RabbitmqModule } from "building-blocks/src/modules/rabbitmq/rabbitmq.module";

@Module({
    imports: [
        OpenTelemetryModule,
        RabbitmqModule,
        TypeOrmModule.forRoot(postgresOptions),
        CatalogModule,
        UserModule,
        RouterModule.register([
            {
                path: 'catalogs',
                module: CatalogModule,
            },
            {
                path: 'users',
                module: UserModule,
            },
        ]),
    ],
    providers: [],
})
export class AppModule {}
