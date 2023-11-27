import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateCatalogTable1701088677650 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
