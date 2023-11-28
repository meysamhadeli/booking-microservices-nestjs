"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const token_entity_1 = require("../auth/entities/token.entity");
const create_user_1 = require("./features/v1/createUser/create-user");
const rabbitmq_module_1 = require("building-blocks/src/modules/rabbitmq/rabbitmq.module");
const user_repository_1 = require("../data/repositories/user.repository");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, rabbitmq_module_1.RabbitmqModule, typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, token_entity_1.Token])],
        controllers: [create_user_1.CreateUserController],
        providers: [create_user_1.CreateUserHandler, {
                provide: 'IUserRepository',
                useClass: user_repository_1.UserRepository,
            }],
        exports: [],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map