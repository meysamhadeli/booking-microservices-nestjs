import { Repository } from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";
import {Flight} from "../../flight/entities/flight.entity";

export interface IFlightRepository {
  createFlight(flight: Flight): Promise<Flight>;
  findFlightByNumber(flightNumber: string): Promise<Flight>;
  findFlightById(id: number): Promise<Flight>;
  getAll(): Promise<Flight[]>;
}

export class FlightRepository implements IFlightRepository {
  constructor(@InjectRepository(Flight)
              private readonly flightRepository: Repository<Flight>) {
  }

  async createFlight(flight: Flight): Promise<Flight> {
    return await this.flightRepository.save(flight);
  }

  async findFlightByNumber(flightNumber: string): Promise<Flight> {
    return await this.flightRepository.findOneBy({
      flightNumber: flightNumber
    });
  }

  async findFlightById(id: number): Promise<Flight> {
    return await this.flightRepository.findOneBy({
      id: id
    });
  }

  async getAll(): Promise<Flight[]> {
    return await this.flightRepository.find();
  }
}
