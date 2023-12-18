import {MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap} from '@nestjs/common';
import {RouterModule} from '@nestjs/core';
import {TypeOrmModule} from '@nestjs/typeorm';
import {postgresOptions} from './data/data-source';
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {FlightModule} from "./flight/flight.module";
import {AircraftModule} from "./aircraft/aircraft.module";
import {AirportModule} from "./airport/airport.module";
import {SeatModule} from "./seat/seat.module";
import {DataSeeder} from "./data/seeds/data-seeder";
import {OpenTelemetryModule} from "building-blocks/openTelemetry/open-telemetry.module";
import {JwtStrategy} from "building-blocks/passport/jwt.strategy";
import configs from "building-blocks/configs/configs";
import {HttpContextMiddleware} from "building-blocks/context/context";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: configs.jwt.secret,
            signOptions: {expiresIn: configs.jwt.refreshExpirationDays},
        }),
        OpenTelemetryModule.forRoot(),
        TypeOrmModule.forRoot(postgresOptions),
        FlightModule,
        AircraftModule,
        AirportModule,
        SeatModule,
        RouterModule.register([
            {
                path: '/',
                module: FlightModule,
            },
            {
                path: '/',
                module: AircraftModule,
            },
            {
                path: '/',
                module: AirportModule,
            },
            {
                path: '/',
                module: SeatModule,
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