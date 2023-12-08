import {PassengerType} from "../enums/passenger-type.enum";

export class PassengerDto {
    id: number;
    name: string;
    age: number;
    passportNumber: string;
    passportType: PassengerType;
    createdAt: Date;
    updatedAt?: Date;
}
