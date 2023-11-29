import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import {Flight} from "../../flight/entities/flight.entity";

@Entity()
export class Aircraft {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  model: string;

  @Column()
  manufacturingYear: number;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date | null;

  @OneToMany(() => Flight, (flight) => flight.aircraft)
  flights: Flight[];

  constructor(partial?: Partial<Aircraft>) {
    Object.assign(this, partial);
    this.createdAt = partial?.createdAt ?? new Date();
  }
}
