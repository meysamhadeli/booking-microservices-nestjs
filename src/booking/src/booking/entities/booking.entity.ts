import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    flightNumber: string;

    @Column()
    aircraftId: number;

    @Column()
    departureAirportId: number;

    @Column()
    arriveAirportId: number;

    @Column()
    flightDate: Date;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column()
    seatNumber: string;

    @Column()
    passengerName: string;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt?: Date | null;

    constructor(partial?: Partial<Booking>) {
        Object.assign(this, partial);
        this.createdAt = partial?.createdAt ?? new Date();
    }
}
