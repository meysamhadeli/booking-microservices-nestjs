import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresOptions } from './data/data-source';
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import configs from "building-blocks/configs/configs";
import {OpenTelemetryModule} from "building-blocks/openTelemetry/open-telemetry.module";
import {JwtStrategy} from "building-blocks/passport/jwt.strategy";
import {ConfigModule} from "@nestjs/config";
import {PassengerModule} from "./passenger/passenger.module";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: configs.jwt.secret,
            signOptions: {expiresIn: configs.jwt.refreshExpirationDays},
        }),
        OpenTelemetryModule,
        TypeOrmModule.forRoot(postgresOptions),
        PassengerModule,
        RouterModule.register([
            {
                path: 'passengers',
                module: PassengerModule,
            }
        ]),
    ],
    providers: [JwtStrategy],
})
export class AppModule {}
