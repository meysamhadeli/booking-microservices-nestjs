import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FlightRepository} from "../data/repositories/flightRepository";
import {Flight} from "./entities/flight.entity";
import {Aircraft} from "../aircraft/entities/aircraft.entity";
import {Airport} from "../airport/entities/airport.entity";
import {Seat} from "../seat/entities/seat.entity";
import {AircraftRepository} from "../data/repositories/aircraftRepository";
import {AirportRepository} from "../data/repositories/airportRepository";
import {SeatRepository} from "../data/repositories/seatRepository";
import {CreateFlightController, CreateFlightHandler} from "./features/v1/create-flight/create-flight";
import {GetFlightByIdController, GetFlightByIdHandler} from "./features/v1/get-flight-by-id/get-flight-by-id";
import {RabbitmqModule} from "building-blocks/rabbitmq/rabbitmq.module";

@Module({
    imports: [CqrsModule, RabbitmqModule, TypeOrmModule.forFeature([Flight, Aircraft, Airport, Seat])],
    controllers: [CreateFlightController, GetFlightByIdController],
    providers: [
        CreateFlightHandler, GetFlightByIdHandler,
        {
            provide: 'IFlightRepository',
            useClass: FlightRepository,
        },
        {
            provide: 'IAircraftRepository',
            useClass: AircraftRepository,
        },
        {
            provide: 'IAirportRepository',
            useClass: AirportRepository,
        },
        {
            provide: 'ISeatRepository',
            useClass: SeatRepository,
        },
    ],
    exports: [],
})
export class FlightModule {}
