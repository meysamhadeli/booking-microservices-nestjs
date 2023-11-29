import { TypeMapper } from 'ts-mapper';
import {SeatDto} from "./dtos/seat.dto";
import {Seat} from "./entities/seat.entity";

export class Mapper extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<Seat, SeatDto>()
      .map(
        (src) => src.id,
        (dest) => dest.id
      )
      .map(
        (src) => src.seatType,
        (dest) => dest.seatType
      )
      .map(
        (src) => src.seatClass,
        (dest) => dest.seatClass
      )
      .map(
        (src) => src.seatNumber,
        (dest) => dest.seatNumber
      )
      .map(
        (src) => src?.updatedAt,
        (dest) => dest?.updatedAt
      )
      .map(
        (src) => src.createdAt,
        (dest) => dest.createdAt
      )
      .map(
        (src) => src.isReserved,
        (dest) => dest.isReserved
      )
      .map(
        (src) => src.flightId,
        (dest) => dest.flightId
      );
  }
}

const mapper = new Mapper();

export default mapper;
