import { Injectable } from '@nestjs/common';
import {EntityManager} from "typeorm";
import {Aircraft} from "../../aircraft/entities/aircraft.entity";
import {Airport} from "../../airport/entities/airport.entity";
import {Flight} from "../../flight/entities/flight.entity";
import {FlightStatus} from "../../flight/enums/flight-status.enum";
import {Seat} from "../../seat/entities/seat.entity";
import {SeatClass} from "../../seat/enums/seat-class.enum";
import {SeatType} from "../../seat/enums/seat-type.enum";

@Injectable()
export class DataSeeder {
    constructor(private readonly entityManager: EntityManager
    ) {
    }

    async seedAsync(): Promise<void> {
        await this.seedAircraft();
        await this.seedAirport();
        await this.seedFlight();
        await this.seedSeats();
    }

    private async seedAircraft(): Promise<void> {

        const aircraftRepository = this.entityManager.getRepository(Aircraft);
        if ((await aircraftRepository.find())?.length == 0) {
            await aircraftRepository.save(
                new Aircraft({
                    id: 1,
                    name: 'airbus',
                    manufacturingYear: 2002,
                    model: '3300'
                })
            );
        }
    }

    private async seedAirport(): Promise<void> {
        const airportRepository = this.entityManager.getRepository(Airport);

        if ((await airportRepository.find())?.length == 0) {
            await airportRepository.save(
                new Airport({
                    id: 1,
                    name: 'mehrabad',
                    code: '1422',
                    address: 'tehran'
                })
            );
        }
    }

    private async seedFlight(): Promise<void> {

        const flightRepository = this.entityManager.getRepository(Flight);

        if ((await flightRepository.find())?.length == 0) {
            await flightRepository.save(
                new Flight({
                    id: 1,
                    flightDate: new Date('2023-09-30'),
                    flightStatus: FlightStatus.COMPLETED,
                    flightNumber: '1299',
                    aircraftId: 1,
                    price: 800,
                    departureAirportId: 1,
                    departureDate: new Date('2023-09-31'),
                    arriveAirportId: 1,
                    arriveDate: new Date('2023-09-31'),
                    durationMinutes: 1000
                })
            );
        }
    }

    private async seedSeats(): Promise<void> {

        const seatRepository = this.entityManager.getRepository(Seat);

        if ((await seatRepository.find())?.length == 0) {
            const seats: Seat[] = [
                new Seat({
                    flightId: 1,
                    seatNumber: '11A',
                    seatClass: SeatClass.FIRST_CLASS,
                    seatType: SeatType.WINDOW
                }),
                new Seat({
                    flightId: 1,
                    seatNumber: '12B',
                    seatClass: SeatClass.ECONOMY,
                    seatType: SeatType.MIDDLE
                })
            ];

            for (const seat of seats) {
                await seatRepository.save(seat);
            }
        }
    }
}
