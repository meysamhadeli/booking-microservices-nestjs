import { TypeMapper } from 'ts-mapper';
import {PassengerDto} from "./dtos/passenger.dto";
import {Passenger} from "./entities/passenger.entity";

export class Mapper extends TypeMapper {
    constructor() {
        super();
        this.config();
    }

    private config(): void {
        this.createMap<Passenger, PassengerDto>()
            .map(
                (src) => src.name,
                (dest) => dest.name
            )
            .map(
                (src) => src.id,
                (dest) => dest.id
            )
            .map(
                (src) => src.passportNumber,
                (dest) => dest.passportNumber
            )
            .map(
                (src) => src.age,
                (dest) => dest.age
            )
            .map(
                (src) => src.passengerType,
                (dest) => dest.passportType
            )
            .map(
                (src) => src.createdAt,
                (dest) => dest.createdAt
            )
            .map(
                (src) => src?.updatedAt,
                (dest) => dest?.updatedAt
            );

    }
}

const mapper = new Mapper();

export default mapper;
