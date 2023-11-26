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
const catalog_entity_1 = require("../../../entities/catalog.entity");
const rabbitmq_publisher_1 = require("../../../../modules/rabbitmq/rabbitmq-publisher");
const catalog_contracts_1 = require("../../../../contracts/catalog.contracts");
const catalog_dto_1 = require("../../../dtos/catalog.dto");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
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
    constructor(rabbitmqPublisher, catalogRepository) {
        this.rabbitmqPublisher = rabbitmqPublisher;
        this.catalogRepository = catalogRepository;
    }
    async execute(command) {
        common_1.Logger.log(`Name: ${command.name} | Price: ${command.price}`);
        const catalog = mappings_1.default.map(command, new catalog_entity_1.Catalog());
        const catalogEntity = await this.catalogRepository.save(catalog);
        await this.rabbitmqPublisher.publishMessage(new catalog_contracts_1.CatalogCreated({
            name: catalogEntity === null || catalogEntity === void 0 ? void 0 : catalogEntity.name,
            price: catalogEntity === null || catalogEntity === void 0 ? void 0 : catalogEntity.price,
            id: catalogEntity === null || catalogEntity === void 0 ? void 0 : catalogEntity.id,
        }));
        const catalogDto = mappings_1.default.map(catalogEntity, new catalog_dto_1.CatalogDto());
        return catalogDto;
    }
};
exports.CreateCatalogHandler = CreateCatalogHandler;
exports.CreateCatalogHandler = CreateCatalogHandler = __decorate([
    (0, cqrs_1.CommandHandler)(CreateCatalog),
    __param(1, (0, typeorm_1.InjectRepository)(catalog_entity_1.Catalog)),
    __metadata("design:paramtypes", [rabbitmq_publisher_1.RabbitmqPublisher,
        typeorm_2.Repository])
], CreateCatalogHandler);
//# sourceMappingURL=create-catalog.js.map