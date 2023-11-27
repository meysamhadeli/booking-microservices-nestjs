"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCatalogConsumerHandler = void 0;
const common_1 = require("@nestjs/common");
const createCatalogConsumerHandler = async (queue, message) => {
    common_1.Logger.log(`Catalog with id: ${message === null || message === void 0 ? void 0 : message.id}, name: ${message === null || message === void 0 ? void 0 : message.name} and price: ${message === null || message === void 0 ? void 0 : message.price} created.`);
};
exports.createCatalogConsumerHandler = createCatalogConsumerHandler;
//# sourceMappingURL=create-catalog.js.map