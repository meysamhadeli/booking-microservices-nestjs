import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresOptions } from './data/data-source';
import { UserModule } from "./user/user.module";
import {AuthModule} from "./auth/auth.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import configs from "../../building-blocks/configs/configs";
import {OpenTelemetryModule} from "building-blocks/openTelemetry/open-telemetry.module";
import {JwtStrategy} from "building-blocks/passport/jwt.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: configs.jwt.secret,
            signOptions: {expiresIn: configs.jwt.refreshExpirationDays},
        }),
        OpenTelemetryModule,
        TypeOrmModule.forRoot(postgresOptions),
        UserModule,
        AuthModule,
        RouterModule.register([
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
