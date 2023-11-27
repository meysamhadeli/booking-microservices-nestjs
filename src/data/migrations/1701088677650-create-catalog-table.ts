import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCatalogTable1701088677650 implements MigrationInterface {
    name = 'CreateCatalogTable1701088677650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "catalog" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_782754bded12b4e75ad4afff913" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "catalog"`);
    }

}
