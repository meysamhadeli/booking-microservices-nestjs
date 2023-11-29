import {FlightStatus} from "../enums/flight-status.enum";

export class FlightDto {
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

  constructor(request: Partial<FlightDto> = {}) {
    Object.assign(this, request);
  }
}
