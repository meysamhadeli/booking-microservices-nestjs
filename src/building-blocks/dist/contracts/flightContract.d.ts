import { IEvent } from "@nestjs/cqrs";
export declare class FlightCreated implements IEvent {
    id: number;
    flightNumber: string;
    price: number;
    flightStatus: FlightStatus;
    flightDate: Date;
    departureDate: Date;
    departureAirportId: number;
    aircraftId: number;
    arriveDate: Date;
    arriveAirportId: number;
    durationMinutes: number;
    createdAt: Date;
    updatedAt?: Date;
    constructor(request?: Partial<FlightCreated>);
}
export declare class AircraftCreated implements IEvent {
    id: number;
    model: string;
    name: string;
    manufacturingYear: number;
    createdAt: Date;
    updatedAt?: Date;
    constructor(request?: Partial<AircraftCreated>);
}
export declare class AirportCreated implements IEvent {
    id: number;
    code: string;
    name: string;
    address: string;
    createdAt: Date;
    updatedAt?: Date;
    constructor(request?: Partial<AirportCreated>);
}
export declare class SeatCreated implements IEvent {
    id: number;
    seatNumber: string;
    seatClass: SeatClass;
    seatType: SeatType;
    flightId: number;
    isReserved: boolean;
    createdAt: Date;
    updatedAt?: Date;
    constructor(request?: Partial<SeatCreated>);
}
export declare class SeatReserved implements IEvent {
    id: number;
    seatNumber: string;
    seatClass: SeatClass;
    seatType: SeatType;
    flightId: number;
    isReserved: boolean;
    createdAt: Date;
    updatedAt?: Date;
    constructor(request?: Partial<SeatReserved>);
}
export declare class FlightDto {
    id: number;
    flightNumber: string;
    price: number;
    flightStatus: FlightStatus;
    flightDate: Date;
    departureDate: Date;
    departureAirportId: number;
    aircraftId: number;
    arriveDate: Date;
    arriveAirportId: number;
    durationMinutes: number;
    createdAt: Date;
    updatedAt?: Date;
    constructor(request?: Partial<FlightDto>);
}
export declare class SeatDto {
    id: number;
    seatNumber: string;
    seatClass: SeatClass;
    seatType: SeatType;
    flightId: number;
    isReserved: boolean;
    createdAt: Date;
    updatedAt?: Date;
    constructor(request?: Partial<SeatDto>);
}
export declare class ReserveSeatRequestDto {
    seatNumber: string;
    flightId: number;
    constructor(request?: Partial<ReserveSeatRequestDto>);
}
export declare enum FlightStatus {
    UNKNOWN = 0,
    FLYING = 1,
    DELAY = 2,
    CANCELED = 3,
    COMPLETED = 4
}
export declare enum SeatClass {
    UNKNOWN = 0,
    FIRST_CLASS = 1,
    BUSINESS = 2,
    ECONOMY = 3
}
export declare enum SeatType {
    UNKNOWN = 0,
    WINDOW = 1,
    MIDDLE = 2,
    AISLE = 3
}
