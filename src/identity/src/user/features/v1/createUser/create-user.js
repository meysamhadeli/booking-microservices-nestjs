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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserHandler = exports.CreateUserController = exports.CreateUserRequestDto = exports.CreateUser = void 0;
const user_dto_1 = require("../../../dtos/user.dto");
const mapping_1 = __importDefault(require("../../../mapping"));
const joi_1 = __importDefault(require("joi"));
const role_enum_1 = require("../../../enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const user_entity_1 = require("../../../entities/user.entity");
const identityContract_1 = require("../../../../../../building-blocks/src/contracts/identityContract");
const rabbitmq_publisher_1 = require("building-blocks/src/modules/rabbitmq/rabbitmq-publisher");
const encryption_1 = require("building-blocks/src/utils/encryption");
const validation_1 = require("building-blocks/src/utils/validation");
class CreateUser {
    constructor(request = {}) {
        Object.assign(this, request);
    }
}
exports.CreateUser = CreateUser;
class CreateUserRequestDto {
    constructor(request = {}) {
        Object.assign(this, request);
    }
}
exports.CreateUserRequestDto = CreateUserRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUserRequestDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUserRequestDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUserRequestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateUserRequestDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUserRequestDto.prototype, "passportNumber", void 0);
const createUserValidations = joi_1.default.object({
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().required().custom(validation_1.password),
    name: joi_1.default.string().required(),
    passportNumber: joi_1.default.string().required(),
    role: joi_1.default.string().required().valid(role_enum_1.Role.USER, role_enum_1.Role.ADMIN)
});
let CreateUserController = class CreateUserController {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    createUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commandBus.execute(new CreateUser({
                email: request.email,
                password: request.password,
                name: request.name,
                role: request.role,
                passportNumber: request.passportNumber
            }));
        });
    }
};
exports.CreateUserController = CreateUserController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiResponse)({ status: 401, description: common_1.HttpStatus.FORBIDDEN.toString() }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: common_1.HttpStatus.CREATED.toString()
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserRequestDto]),
    __metadata("design:returntype", Promise)
], CreateUserController.prototype, "createUser", null);
exports.CreateUserController = CreateUserController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)({
        path: `/user`,
        version: '1',
    }),
    __metadata("design:paramtypes", [cqrs_1.CommandBus])
], CreateUserController);
let CreateUserHandler = class CreateUserHandler {
    constructor(rabbitmqPublisher, userRepository) {
        this.rabbitmqPublisher = rabbitmqPublisher;
        this.userRepository = userRepository;
    }
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            yield createUserValidations.validateAsync(command);
            const existUser = yield this.userRepository.findUserByEmail(command.email);
            if (existUser) {
                throw new common_1.ConflictException('Email already taken');
            }
            const userEntity = yield this.userRepository.createUser(new user_entity_1.User({
                email: command.email,
                name: command.name,
                password: yield (0, encryption_1.encryptPassword)(command.password),
                role: command.role,
                passportNumber: command.passportNumber,
                isEmailVerified: false
            }));
            yield this.rabbitmqPublisher.publishMessage(new identityContract_1.UserCreated(userEntity));
            const result = mapping_1.default.map(userEntity, new user_dto_1.UserDto());
            return result;
        });
    }
};
exports.CreateUserHandler = CreateUserHandler;
exports.CreateUserHandler = CreateUserHandler = __decorate([
    (0, cqrs_1.CommandHandler)(CreateUser),
    __param(1, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [rabbitmq_publisher_1.RabbitmqPublisher, Object])
], CreateUserHandler);
//# sourceMappingURL=create-user.js.map