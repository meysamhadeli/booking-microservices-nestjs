"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeatType = exports.SeatClass = exports.FlightStatus = exports.ReserveSeatRequestDto = exports.SeatDto = exports.FlightDto = exports.SeatReserved = exports.SeatCreated = exports.AirportCreated = exports.AircraftCreated = exports.FlightCreated = void 0;
class FlightCreated {
    id;
    flightNumber;
    price;
    flightStatus;
    flightDate;
    departureDate;
    departureAirportId;
    aircraftId;
    arriveDate;
    arriveAirportId;
    durationMinutes;
    createdAt;
    updatedAt;
    constructor(request = {}) {
        Object.assign(this, request);
    }
}
exports.FlightCreated = FlightCreated;
class AircraftCreated {
    id;
    model;
    name;
    manufacturingYear;
    createdAt;
    updatedAt;
    constructor(request = {}) {
        Object.assign(this, request);
    }
}
exports.AircraftCreated = AircraftCreated;
class AirportCreated {
    id;
    code;
    name;
    address;
    createdAt;
    updatedAt;
    constructor(request = {}) {
        Object.assign(this, request);
    }
}
exports.AirportCreated = AirportCreated;
class SeatCreated {
    id;
    seatNumber;
    seatClass;
    seatType;
    flightId;
    isReserved;
    createdAt;
    updatedAt;
    constructor(request = {}) {
        Object.assign(this, request);
    }
}
exports.SeatCreated = SeatCreated;
class SeatReserved {
    id;
    seatNumber;
    seatClass;
    seatType;
    flightId;
    isReserved;
    createdAt;
    updatedAt;
    constructor(request = {}) {
        Object.assign(this, request);
    }
}
exports.SeatReserved = SeatReserved;
class FlightDto {
    id;
    flightNumber;
    price;
    flightStatus;
    flightDate;
    departureDate;
    departureAirportId;
    aircraftId;
    arriveDate;
    arriveAirportId;
    durationMinutes;
    createdAt;
    updatedAt;
    constructor(request = {}) {
        Object.assign(this, request);
    }
}
exports.FlightDto = FlightDto;
class SeatDto {
    id;
    seatNumber;
    seatClass;
    seatType;
    flightId;
    isReserved;
    createdAt;
    updatedAt;
    constructor(request = {}) {
        Object.assign(this, request);
    }
}
exports.SeatDto = SeatDto;
class ReserveSeatRequestDto {
    seatNumber;
    flightId;
    constructor(request = {}) {
        Object.assign(this, request);
    }
}
exports.ReserveSeatRequestDto = ReserveSeatRequestDto;
var FlightStatus;
(function (FlightStatus) {
    FlightStatus[FlightStatus["UNKNOWN"] = 0] = "UNKNOWN";
    FlightStatus[FlightStatus["FLYING"] = 1] = "FLYING";
    FlightStatus[FlightStatus["DELAY"] = 2] = "DELAY";
    FlightStatus[FlightStatus["CANCELED"] = 3] = "CANCELED";
    FlightStatus[FlightStatus["COMPLETED"] = 4] = "COMPLETED";
})(FlightStatus || (exports.FlightStatus = FlightStatus = {}));
var SeatClass;
(function (SeatClass) {
    SeatClass[SeatClass["UNKNOWN"] = 0] = "UNKNOWN";
    SeatClass[SeatClass["FIRST_CLASS"] = 1] = "FIRST_CLASS";
    SeatClass[SeatClass["BUSINESS"] = 2] = "BUSINESS";
    SeatClass[SeatClass["ECONOMY"] = 3] = "ECONOMY";
})(SeatClass || (exports.SeatClass = SeatClass = {}));
var SeatType;
(function (SeatType) {
    SeatType[SeatType["UNKNOWN"] = 0] = "UNKNOWN";
    SeatType[SeatType["WINDOW"] = 1] = "WINDOW";
    SeatType[SeatType["MIDDLE"] = 2] = "MIDDLE";
    SeatType[SeatType["AISLE"] = 3] = "AISLE";
})(SeatType || (exports.SeatType = SeatType = {}));
//# sourceMappingURL=flight.contract.js.map