"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCatalogConsumerHandler = void 0;
const common_1 = require("@nestjs/common");
const createCatalogConsumerHandler = (queue, message) => __awaiter(void 0, void 0, void 0, function* () {
    common_1.Logger.log(`Catalog with id: ${message === null || message === void 0 ? void 0 : message.id}, name: ${message === null || message === void 0 ? void 0 : message.name} and price: ${message === null || message === void 0 ? void 0 : message.price} created.`);
});
exports.createCatalogConsumerHandler = createCatalogConsumerHandler;
//# sourceMappingURL=create-catalog.js.map