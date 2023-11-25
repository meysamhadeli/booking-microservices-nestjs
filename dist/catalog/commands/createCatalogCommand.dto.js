"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCatalogCommandDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateCatalogCommandDto {
    constructor(request = {}) {
        Object.assign(this, request);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { catalogName: { required: true, type: () => String }, price: { required: true, type: () => Number } };
    }
}
exports.CreateCatalogCommandDto = CreateCatalogCommandDto;
//# sourceMappingURL=createCatalogCommand.dto.js.map