import { TypeMapper } from 'ts-mapper';
import { FlightDto } from './dtos/flight.dto';
import {Flight} from "./entities/flight.entity";

export class Mapper extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<Flight, FlightDto>()
      .map(
        (src) => src.durationMinutes,
        (dest) => dest.durationMinutes
      )
      .map(
        (src) => src.flightStatus,
        (dest) => dest.flightStatus
      )
      .map(
        (src) => src.id,
        (dest) => dest.id
      )
      .map(
        (src) => src.createdAt,
        (dest) => dest.createdAt
      )
      .map(
        (src) => src.updatedAt,
        (dest) => dest.updatedAt
      )
      .map(
        (src) => src.flightDate,
        (dest) => dest.flightDate
      )
      .map(
        (src) => src.arriveDate,
        (dest) => dest.arriveDate
      )
      .map(
        (src) => src.arriveAirportId,
        (dest) => dest.arriveAirportId
      )
      .map(
        (src) => src.departureDate,
        (dest) => dest.departureDate
      )
      .map(
        (src) => src.departureAirportId,
        (dest) => dest.departureAirportId
      )
      .map(
        (src) => src.departureAirportId,
        (dest) => dest.departureAirportId
      )
      .map(
        (src) => src.price,
        (dest) => dest.price
      )
      .map(
        (src) => src.aircraftId,
        (dest) => dest.aircraftId
      )
      .map(
        (src) => src.flightNumber,
        (dest) => dest.flightNumber
      );
  }
}

const mapper = new Mapper();

export default mapper;
