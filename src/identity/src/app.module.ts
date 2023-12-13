import {MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap} from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from "./user/user.module";
import {AuthModule} from "./auth/auth.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {OpenTelemetryModule} from "building-blocks/openTelemetry/open-telemetry.module";
import {JwtStrategy} from "building-blocks/passport/jwt.strategy";
import configs from "building-blocks/configs/configs";
import {postgresOptions} from "./data/data-source";
import {DataSeeder} from "./data/seeds/data-seeder";
import {HttpContextMiddleware} from "building-blocks/context/context";

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
                path: '/',
                module: UserModule,
            },
            {
                path: '/',
                module: AuthModule,
            },
        ]),
    ],
    providers: [JwtStrategy, DataSeeder],
})
export class AppModule implements OnApplicationBootstrap, NestModule {
    constructor(
        private readonly dataSeeder: DataSeeder,
    ) {
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(HttpContextMiddleware)
            .forRoutes('*');
    }

    async onApplicationBootstrap(): Promise<void> {
        await this.dataSeeder.seedAsync();
    }
}

