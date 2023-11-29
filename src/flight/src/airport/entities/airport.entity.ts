import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import {Flight} from "../../flight/entities/flight.entity";

@Entity()
export class Airport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  code: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date | null;

  @OneToMany(() => Flight, (flight) => flight.departureAirport)
  departureFlights: Flight[];

  @OneToMany(() => Flight, (flight) => flight.arriveAirport)
  arrivalFlights: Flight[];

  constructor(partial?: Partial<Airport>) {
    Object.assign(this, partial);
    this.createdAt = partial?.createdAt ?? new Date();
  }
}
