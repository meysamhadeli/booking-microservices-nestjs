import { TypeMapper } from 'ts-mapper';
import {AirportDto} from "./dtos/airport.dto";
import {Airport} from "./entities/airport.entity";

export class Mapper extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<Airport, AirportDto>()
      .map(
        (src) => src.name,
        (dest) => dest.name
      )
      .map(
        (src) => src.address,
        (dest) => dest.address
      )
      .map(
        (src) => src.code,
        (dest) => dest.code
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
        (src) => src.id,
        (dest) => dest.id
      );
  }
}

const mapper = new Mapper();

export default mapper;
