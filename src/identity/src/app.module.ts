import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CatalogModule } from './catalog/catalog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresOptions } from './data/data-source';
import { UserModule } from "./user/user.module";
import { OpenTelemetryModule } from "building-blocks/src/modules/openTelemetry/open-telemetry.module";
import { RabbitmqModule } from "building-blocks/src/modules/rabbitmq/rabbitmq.module";
import {AuthModule} from "./auth/auth.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import configs from "../../building-blocks/src/configs/configs";
import {JwtStrategy} from "../../building-blocks/src/passport/jwt.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: configs.jwt.secret,
            signOptions: {expiresIn: configs.jwt.refreshExpirationDays},
        }),
        OpenTelemetryModule,
        RabbitmqModule,
        TypeOrmModule.forRoot(postgresOptions),
        CatalogModule,
        UserModule,
        AuthModule,
        RouterModule.register([
            {
                path: 'catalogs',
                module: CatalogModule,
            },
            {
                path: 'users',
                module: UserModule,
            },
            {
                path: 'identities',
                module: AppModule,
            },
        ]),
    ],
    providers: [JwtStrategy],
})
export class AppModule {}
