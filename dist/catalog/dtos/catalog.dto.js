"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogDto = void 0;
const openapi = require("@nestjs/swagger");
class CatalogDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, price: { required: true, type: () => Number }, name: { required: true, type: () => String } };
    }
}
exports.CatalogDto = CatalogDto;
//# sourceMappingURL=catalog.dto.js.map