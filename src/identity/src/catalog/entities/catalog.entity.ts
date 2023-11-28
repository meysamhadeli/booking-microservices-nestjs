import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Catalog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    constructor(partial?: Partial<Catalog>) {
        Object.assign(this, partial);
    }
}
