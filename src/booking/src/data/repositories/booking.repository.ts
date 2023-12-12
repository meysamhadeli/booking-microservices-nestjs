import { Repository } from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";
import {Booking} from "../../booking/entities/booking.entity";

export interface IBookingRepository {
  createBooking(booking: Booking): Promise<Booking>;
}

export class BookingRepository implements IBookingRepository {
  constructor(@InjectRepository(Booking)
              private readonly bookingRepository: Repository<Booking>) {
  }

  async createBooking(booking: Booking): Promise<Booking> {
    return  await this.bookingRepository.save(booking);
  }
}
