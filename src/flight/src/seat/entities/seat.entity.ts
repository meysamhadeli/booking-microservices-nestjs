import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import {SeatClass} from "../enums/seat-class.enum";
import {SeatType} from "../enums/seat-type.enum";
import {Flight} from "../../flight/entities/flight.entity";

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seatNumber: string;

  @Column({
    type: 'enum',
    enum: SeatClass,
    default: SeatClass.UNKNOWN
  })
  seatClass: SeatClass;

  @Column({
    type: 'enum',
    enum: SeatType,
    default: SeatType.UNKNOWN
  })
  seatType: SeatType;

  @Column()
  flightId: number;

  @Column({ type: 'boolean', default: false })
  isReserved: boolean;

  @ManyToOne(() => Flight, (flight) => flight.seats)
  flight?: Flight;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date | null;

  constructor(partial?: Partial<Seat>) {
    Object.assign(this, partial);
    this.createdAt = partial?.createdAt ?? new Date();
  }
}
