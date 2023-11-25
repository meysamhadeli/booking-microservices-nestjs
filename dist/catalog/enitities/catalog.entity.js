"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Catalog = void 0;
const openapi = require("@nestjs/swagger");
class Catalog {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, price: { required: true, type: () => Number } };
    }
}
exports.Catalog = Catalog;
//# sourceMappingURL=catalog.entity.js.map