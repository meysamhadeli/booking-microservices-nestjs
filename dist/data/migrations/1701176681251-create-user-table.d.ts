import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateUserTable1701176681251 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
