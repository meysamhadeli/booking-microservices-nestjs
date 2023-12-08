import {Module, OnApplicationBootstrap} from '@nestjs/common';
import {RouterModule} from '@nestjs/core';
import {TypeOrmModule} from '@nestjs/typeorm';
import {postgresOptions} from './data/data-source';
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import configs from "../../building-blocks/configs/configs";
import {FlightModule} from "./flight/flight.module";
import {AircraftModule} from "./aircraft/aircraft.module";
import {AirportModule} from "./airport/airport.module";
import {SeatModule} from "./seat/seat.module";
import {DataSeeder} from "./data/seeds/data-seeder";
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
        FlightModule,
        AircraftModule,
        AirportModule,
        SeatModule,
        RouterModule.register([
            {
                path: 'flights',
                module: FlightModule,
            },
            {
                path: 'aircrafts',
                module: AircraftModule,
            },
            {
                path: 'airports',
                module: AirportModule,
            },
            {
                path: 'seats',
                module: SeatModule,
            },
        ]),
    ],
    providers: [JwtStrategy, DataSeeder],
})
export class AppModule implements OnApplicationBootstrap {
    constructor(
        private readonly dataSeeder: DataSeeder,
    ) {
    }

    async onApplicationBootstrap(): Promise<void> {
        await this.dataSeeder.seedAsync();
    }
}
