import { TypeMapper } from 'ts-mapper';
import {Booking} from "./entities/booking.entity";
import {BookingDto} from "./dtos/booking.dto";

export class Mapper extends TypeMapper {
    constructor() {
        super();
        this.config();
    }

    private config(): void {
        this.createMap<Booking, BookingDto>()
            .map(
                (src) => src.id,
                (dest) => dest.id
            )
            .map(
                (src) => src.createdAt,
                (dest) => dest.createdAt
            )
            .map(
                (src) => src?.updatedAt,
                (dest) => dest?.updatedAt
            )
            .map(
                (src) => src.aircraftId,
                (dest) => dest.aircraftId
            )
            .map(
                (src) => src.arriveAirportId,
                (dest) => dest.arriveAirportId
            )
            .map(
                (src) => src.departureAirportId,
                (dest) => dest.departureAirportId
            )
            .map(
                (src) => src.flightDate,
                (dest) => dest.flightDate
            )
            .map(
                (src) => src.description,
                (dest) => dest.description
            )
            .map(
                (src) => src.flightNumber,
                (dest) => dest.flightNumber
            )
            .map(
                (src) => src.passengerName,
                (dest) => dest.passengerName
            )
            .map(
                (src) => src.price,
                (dest) => dest.price
            )
            .map(
                (src) => src.seatNumber,
                (dest) => dest.seatNumber
            );
    }
}

const mapper = new Mapper();

export default mapper;
