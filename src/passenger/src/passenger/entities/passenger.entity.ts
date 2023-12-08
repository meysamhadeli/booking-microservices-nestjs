import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {PassengerType} from "../enums/passenger-type.enum";

@Entity()
export class Passenger {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    passportNumber: string;

    @Column()
    age: number;

    @Column({
        type: 'enum',
        enum: PassengerType, // Use the Role enum for this column
        default: PassengerType.UNKNOWN // Set a default role if needed
    })
    passengerType: PassengerType;

    @Column()
    createdAt: Date;

    @Column({ nullable: true }) // Making 'updatedAt' nullable
    updatedAt?: Date | null; // You can use 'Date | null' to allow null values

    constructor(partial?: Partial<Passenger>) {
        Object.assign(this, partial);
        this.createdAt = partial?.createdAt ?? new Date();
    }
}
