"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCatalogHandler = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const create_catalog_command_1 = require("../commands/create-catalog.command");
let CreateCatalogHandler = class CreateCatalogHandler {
    async execute(command) {
        common_1.Logger.log(`CatalogName: ${command.catalogName} | Price: ${command.price}`);
        return true;
    }
};
exports.CreateCatalogHandler = CreateCatalogHandler;
exports.CreateCatalogHandler = CreateCatalogHandler = __decorate([
    (0, cqrs_1.CommandHandler)(create_catalog_command_1.CreateCatalogCommand)
], CreateCatalogHandler);
//# sourceMappingURL=createCatalogHandler.js.map