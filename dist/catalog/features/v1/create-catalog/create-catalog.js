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
exports.CreateCatalogHandler = exports.CatalogController = exports.CreateCatalog = exports.CreateCatalogDto = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const mappings_1 = __importDefault(require("../../../mappings"));
const rabbitmqPublisher_1 = require("../../../../modules/rabbitmq/rabbitmqPublisher");
const catalog_contracts_1 = require("../../../../contracts/catalog.contracts");
const catalog_dto_1 = require("../../../dtos/catalog.dto");
class CreateCatalogDto {
    constructor(request = {}) {
        Object.assign(this, request);
    }
}
exports.CreateCatalogDto = CreateCatalogDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateCatalogDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateCatalogDto.prototype, "price", void 0);
class CreateCatalog {
    constructor(request = {}) {
        Object.assign(this, request);
    }
}
exports.CreateCatalog = CreateCatalog;
let CatalogController = class CatalogController {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    async CatalogBrandsAsync() {
        common_1.Logger.log('CatalogBrandsAsync');
        const brands = [];
        brands.push({ id: 1, name: '1ABC', price: 12 });
        brands.push({ id: 2, name: '2ABC', price: 13 });
        brands.push({ id: 3, name: '3ABC', price: 14 });
        brands.push({ id: 4, name: '4ABC', price: 15 });
        const catalogDtos = brands.map((brand) => mappings_1.default.map(brand, new catalog_dto_1.CatalogDto()));
        return catalogDtos;
    }
    async ExceptionAsync() {
        common_1.Logger.log('ExceptionAsync');
        throw new common_1.BadRequestException('CustomApiException from ExceptionAsync');
        return true;
    }
    async CreateCatalogAsync(createCatalogDto) {
        common_1.Logger.log(`createCatalogCommand instanceof CreateCatalogCommand: ${createCatalogDto instanceof CreateCatalogDto}`);
        const command = mappings_1.default.map(createCatalogDto, new CreateCatalog());
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
        type: [catalog_dto_1.CatalogDto],
    }),
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
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCatalogDto]),
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
let CreateCatalogHandler = class CreateCatalogHandler {
    constructor(rabbitmqPublisher) {
        this.rabbitmqPublisher = rabbitmqPublisher;
    }
    async execute(command) {
        common_1.Logger.log(`Name: ${command.name} | Price: ${command.price}`);
        const catalogDto = new catalog_dto_1.CatalogDto({
            id: 1,
            name: command === null || command === void 0 ? void 0 : command.name,
            price: command === null || command === void 0 ? void 0 : command.price,
        });
        await this.rabbitmqPublisher.publishMessage(new catalog_contracts_1.CatalogCreated({
            name: catalogDto === null || catalogDto === void 0 ? void 0 : catalogDto.name,
            price: catalogDto === null || catalogDto === void 0 ? void 0 : catalogDto.price,
            id: catalogDto === null || catalogDto === void 0 ? void 0 : catalogDto.id,
        }));
        return catalogDto;
    }
};
exports.CreateCatalogHandler = CreateCatalogHandler;
exports.CreateCatalogHandler = CreateCatalogHandler = __decorate([
    (0, cqrs_1.CommandHandler)(CreateCatalog),
    __metadata("design:paramtypes", [rabbitmqPublisher_1.RabbitmqPublisher])
], CreateCatalogHandler);
//# sourceMappingURL=create-catalog.js.map