import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookingTable1702506382196 implements MigrationInterface {
    name = 'CreateBookingTable1702506382196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "booking" ("id" SERIAL NOT NULL, "flightNumber" character varying NOT NULL, "aircraftId" integer NOT NULL, "departureAirportId" integer NOT NULL, "arriveAirportId" integer NOT NULL, "flightDate" TIMESTAMP NOT NULL, "price" integer NOT NULL, "description" character varying NOT NULL, "seatNumber" character varying NOT NULL, "passengerName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "booking"`);
    }

}
