import { SeatClass } from '@/seat/enums/seat-class.enum';
import { SeatType } from '@/seat/enums/seat-type.enum';

export class SeatDto {
  id: number;
  seatNumber: string;
  seatClass: SeatClass;
  seatType: SeatType;
  flightId: number;
  isReserved: boolean;
  createdAt: Date;
  updatedAt?: Date;

  constructor(request: Partial<SeatDto> = {}) {
    Object.assign(this, request);
  }
}
