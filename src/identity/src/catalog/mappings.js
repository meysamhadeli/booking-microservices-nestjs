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
            .map((src) => src.price, (dest) => dest.price)
            .map((src) => src.name, (dest) => dest.name);
        this.createMap()
            .map((src) => src.price, (dest) => dest.price)
            .map((src) => src.name, (dest) => dest.name)
            .map((src) => src.id, (dest) => dest.id);
        this.createMap()
            .map((src) => src.price, (dest) => dest.price)
            .map((src) => src.name, (dest) => dest.name);
    }
}
exports.Mapper = Mapper;
const mapper = new Mapper();
exports.default = mapper;
//# sourceMappingURL=mappings.js.map