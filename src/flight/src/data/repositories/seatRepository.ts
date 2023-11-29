import { Repository } from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";
import {Seat} from "../../seat/entities/seat.entity";

export interface ISeatRepository {
  createSeat(seat: Seat): Promise<Seat>;

  reserveSeat(seat: Seat): Promise<Seat>;

  getAll(): Promise<Seat[]>;

  getAvailableSeat(flightId: number, seatNumber: string): Promise<Seat>;

  getSeatsByFlightId(flightId: number): Promise<Seat[]>;
}

export class SeatRepository implements ISeatRepository {
  constructor(@InjectRepository(Seat)
              private readonly seatRepository: Repository<Seat>) {
  }

  async createSeat(seat: Seat): Promise<Seat> {
    return await this.seatRepository.save(seat);
  }

  async reserveSeat(seat: Seat): Promise<Seat> {
    return await this.seatRepository.save(seat);
  }

  async getAll(): Promise<Seat[]> {
    return await this.seatRepository.find();
  }

  async getAvailableSeat(flightId: number, seatNumber: string): Promise<Seat> {
    const seat = await this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect('seat.flight', 'flight')
      .where('flight.id = :flightId', { flightId })
      .andWhere('seat.seatNumber = :seatNumber', { seatNumber })
      .andWhere('seat.isReserved = false')
      .getOne();

    return seat;
  }

  async getSeatsByFlightId(flightId: number): Promise<Seat[]> {
    const list = await this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect('seat.flight', 'flight')
      .where('flight.id = :flightId', { flightId })
      .andWhere('seat.isReserved = false')
      .getMany();

    return list;
  }
}
