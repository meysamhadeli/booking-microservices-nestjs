"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const catalog_entity_1 = require("../enitities/catalog.entity");
const create_catalog_dto_1 = require("../dtos/create-catalog.dto");
const mappings_1 = __importDefault(require("../mappings"));
const create_catalog_command_1 = require("../commands/create-catalog.command");
let CatalogController = class CatalogController {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    async CatalogBrandsAsync() {
        common_1.Logger.log('CatalogBrandsAsync');
        const brands = [];
        brands.push({ id: 1, name: '1ABC' });
        brands.push({ id: 2, name: '2ABC' });
        brands.push({ id: 3, name: '3ABC' });
        brands.push({ id: 4, name: '4ABC' });
        return brands;
    }
    async ExceptionAsync() {
        common_1.Logger.log('ExceptionAsync');
        throw new common_1.BadRequestException('CustomApiException from ExceptionAsync');
        return true;
    }
    async CreateCatalogAsync(createCatalogDto) {
        common_1.Logger.log(`createCatalogCommand instanceof CreateCatalogCommand: ${createCatalogDto instanceof create_catalog_dto_1.CreateCatalogDto}`);
        const command = mappings_1.default.map(createCatalogDto, new create_catalog_command_1.CreateCatalogCommand());
        return this.commandBus.execute(command);
    }
};
exports.CatalogController = CatalogController;
__decorate([
    (0, common_1.Get)('brands'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Catalog Brands' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Catalog Brands',
        type: [catalog_entity_1.Catalog],
    }),
    openapi.ApiResponse({ status: 200, type: [require("../enitities/catalog.entity").Catalog] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "CatalogBrandsAsync", null);
__decorate([
    (0, common_1.Get)('exception'),
    (0, swagger_1.ApiOperation)({ summary: 'Exception' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'CustomApiException' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'No Exception',
        type: Boolean,
    }),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "ExceptionAsync", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create Catalog' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Created Catalog Successfully',
        type: Boolean,
    }),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_catalog_dto_1.CreateCatalogDto]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "CreateCatalogAsync", null);
exports.CatalogController = CatalogController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Catalogs'),
    (0, common_1.Controller)({
        path: `/catalog`,
        version: '1',
    }),
    __metadata("design:paramtypes", [cqrs_1.CommandBus])
], CatalogController);
//# sourceMappingURL=catalog.controller.js.map