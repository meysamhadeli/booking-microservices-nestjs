"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCatalogTable1701088677650 = void 0;
class CreateCatalogTable1701088677650 {
    constructor() {
        this.name = 'CreateCatalogTable1701088677650';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "catalog" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_782754bded12b4e75ad4afff913" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "catalog"`);
    }
}
exports.CreateCatalogTable1701088677650 = CreateCatalogTable1701088677650;
//# sourceMappingURL=1701088677650-create-catalog-table.js.map