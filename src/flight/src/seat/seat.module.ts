import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SeatRepository} from "../data/repositories/seatRepository";
import {Seat} from "./entities/seat.entity";
import {Flight} from "../flight/entities/flight.entity";
import {FlightRepository} from "../data/repositories/flightRepository";
import {CreateSeatController, CreateSeatHandler} from "./features/v1/create-seat/create-seat";
import {
    GetAvailableSeatsController,
    GetAvailableSeatsHandler
} from "./features/v1/get-available-seats/get-available-seats";
import {ReserveSeatController, ReserveSeatHandler} from "./features/v1/reserve-seat/reserve-seat";
import {RabbitmqModule} from "building-blocks/rabbitmq/rabbitmq.module";

@Module({
    imports: [CqrsModule, RabbitmqModule.forRoot(), TypeOrmModule.forFeature([Seat, Flight])],
    controllers: [CreateSeatController, GetAvailableSeatsController, ReserveSeatController],
    providers: [
        CreateSeatHandler, GetAvailableSeatsHandler, ReserveSeatHandler,
        {
            provide: 'ISeatRepository',
            useClass: SeatRepository,
        },
        {
            provide: 'IFlightRepository',
            useClass: FlightRepository,
        }
    ],
    exports: [],
})
export class SeatModule {
}
