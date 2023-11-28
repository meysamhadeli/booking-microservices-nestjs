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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const token_type_enum_1 = require("../enums/token-type.enum");
const user_entity_1 = require("../../user/entities/user.entity");
let Token = class Token {
    constructor(partial) {
        var _a;
        Object.assign(this, partial);
        this.createdAt = (_a = partial === null || partial === void 0 ? void 0 : partial.createdAt) !== null && _a !== void 0 ? _a : new Date();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, token: { required: true, type: () => String }, expires: { required: true, type: () => Date }, type: { required: true, enum: require("../enums/token-type.enum").TokenType }, blacklisted: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, user: { required: false, type: () => require("../../user/entities/user.entity").User }, userId: { required: true, type: () => Number } };
    }
};
exports.Token = Token;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Token.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Token.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Token.prototype, "expires", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Token.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Token.prototype, "blacklisted", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Token.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.tokens),
    __metadata("design:type", user_entity_1.User)
], Token.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Token.prototype, "userId", void 0);
exports.Token = Token = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Token);
//# sourceMappingURL=token.entity.js.map