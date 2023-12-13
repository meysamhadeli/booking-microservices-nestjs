import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFlightTable1702506607390 implements MigrationInterface {
    name = 'CreateFlightTable1702506607390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "aircraft" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "model" character varying NOT NULL, "manufacturingYear" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, CONSTRAINT "PK_46f8c680e9ff88a752b7834bba4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "airport" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "code" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, CONSTRAINT "PK_ea1ecba8dec9bee0cb60194e788" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."seat_seatclass_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "public"."seat_seattype_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "seat" ("id" SERIAL NOT NULL, "seatNumber" character varying NOT NULL, "seatClass" "public"."seat_seatclass_enum" NOT NULL DEFAULT '0', "seatType" "public"."seat_seattype_enum" NOT NULL DEFAULT '0', "flightId" integer NOT NULL, "isReserved" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, CONSTRAINT "PK_4e72ae40c3fbd7711ccb380ac17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."flight_flightstatus_enum" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "flight" ("id" SERIAL NOT NULL, "flightNumber" character varying NOT NULL, "price" integer NOT NULL, "flightStatus" "public"."flight_flightstatus_enum" NOT NULL DEFAULT '0', "flightDate" TIMESTAMP NOT NULL, "departureDate" TIMESTAMP NOT NULL, "departureAirportId" integer NOT NULL, "aircraftId" integer NOT NULL, "arriveDate" TIMESTAMP NOT NULL, "arriveAirportId" integer NOT NULL, "durationMinutes" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, CONSTRAINT "PK_bf571ce6731cf071fc51b94df03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "seat" ADD CONSTRAINT "FK_5298809d13db3c04e6bf460e207" FOREIGN KEY ("flightId") REFERENCES "flight"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flight" ADD CONSTRAINT "FK_df523f694abea3ed793a8aef725" FOREIGN KEY ("aircraftId") REFERENCES "aircraft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flight" ADD CONSTRAINT "FK_3a0c5e1517f31f39132ab8ed209" FOREIGN KEY ("departureAirportId") REFERENCES "airport"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flight" ADD CONSTRAINT "FK_e4908c3ca75113e71befdfe36a1" FOREIGN KEY ("arriveAirportId") REFERENCES "airport"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" DROP CONSTRAINT "FK_e4908c3ca75113e71befdfe36a1"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP CONSTRAINT "FK_3a0c5e1517f31f39132ab8ed209"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP CONSTRAINT "FK_df523f694abea3ed793a8aef725"`);
        await queryRunner.query(`ALTER TABLE "seat" DROP CONSTRAINT "FK_5298809d13db3c04e6bf460e207"`);
        await queryRunner.query(`DROP TABLE "flight"`);
        await queryRunner.query(`DROP TYPE "public"."flight_flightstatus_enum"`);
        await queryRunner.query(`DROP TABLE "seat"`);
        await queryRunner.query(`DROP TYPE "public"."seat_seattype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."seat_seatclass_enum"`);
        await queryRunner.query(`DROP TABLE "airport"`);
        await queryRunner.query(`DROP TABLE "aircraft"`);
    }

}
