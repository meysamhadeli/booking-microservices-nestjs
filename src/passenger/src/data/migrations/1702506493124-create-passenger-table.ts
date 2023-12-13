import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePassengerTable1702506493124 implements MigrationInterface {
    name = 'CreatePassengerTable1702506493124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."passenger_passengertype_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "passenger" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "passportNumber" character varying NOT NULL, "age" integer NOT NULL, "passengerType" "public"."passenger_passengertype_enum" NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, CONSTRAINT "PK_50e940dd2c126adc20205e83fac" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "passenger"`);
        await queryRunner.query(`DROP TYPE "public"."passenger_passengertype_enum"`);
    }

}
