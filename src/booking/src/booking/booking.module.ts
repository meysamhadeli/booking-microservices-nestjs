import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RabbitmqModule} from "building-blocks/rabbitmq/rabbitmq.module";
import {Booking} from "./entities/booking.entity";
import {BookingRepository} from "../data/repositories/booking.repository";
import {PassengerClient} from "./http-client/services/passenger/passenger-client";
import {FlightClient} from "./http-client/services/flight/flight.client";
import {CreateBookingController, CreateBookingHandler} from "./features/v1/create-booking/create-booking";



@Module({
    imports: [CqrsModule, RabbitmqModule, TypeOrmModule.forFeature([Booking])],
    controllers: [CreateBookingController],
    providers: [ CreateBookingHandler,
        {
            provide: 'IBookingRepository',
            useClass: BookingRepository,
        },
        {
            provide: 'IPassengerClient',
            useClass: PassengerClient,
        },
        {
            provide: 'IFlightClient',
            useClass: FlightClient,
        }
    ],
    exports: [],
})
export class BookingModule {}
