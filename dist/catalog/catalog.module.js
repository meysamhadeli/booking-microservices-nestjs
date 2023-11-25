"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const create_catalog_1 = require("./features/v1/create-catalog/create-catalog");
const rabbitmqModule_1 = require("../modules/rabbitmq/rabbitmqModule");
let CatalogModule = class CatalogModule {
};
exports.CatalogModule = CatalogModule;
exports.CatalogModule = CatalogModule = __decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, rabbitmqModule_1.RabbitmqModule],
        controllers: [create_catalog_1.CatalogController],
        providers: [create_catalog_1.CreateCatalogHandler],
        exports: [],
    })
], CatalogModule);
//# sourceMappingURL=catalog.module.js.map