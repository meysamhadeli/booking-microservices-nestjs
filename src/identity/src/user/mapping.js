"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mapper = void 0;
const ts_mapper_1 = require("ts-mapper");
class Mapper extends ts_mapper_1.TypeMapper {
    constructor() {
        super();
        this.config();
    }
    config() {
        this.createMap()
            .map((src) => src.name, (dest) => dest.name)
            .map((src) => src.role, (dest) => dest.role)
            .map((src) => src.id, (dest) => dest.id)
            .map((src) => src.email, (dest) => dest.email)
            .map((src) => src === null || src === void 0 ? void 0 : src.updatedAt, (dest) => dest === null || dest === void 0 ? void 0 : dest.updatedAt)
            .map((src) => src.createdAt, (dest) => dest.createdAt)
            .map((src) => src.passportNumber, (dest) => dest.passportNumber)
            .map((src) => src.passportNumber, (dest) => dest.passportNumber)
            .map((src) => src.isEmailVerified, (dest) => dest.isEmailVerified);
    }
}
exports.Mapper = Mapper;
const mapper = new Mapper();
exports.default = mapper;
//# sourceMappingURL=mapping.js.map