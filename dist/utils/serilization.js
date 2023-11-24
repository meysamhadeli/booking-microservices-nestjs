"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeObject = exports.serializeObject = void 0;
const serializeObject = (value) => {
    try {
        return JSON.stringify(value);
    }
    catch (error) {
        throw new Error(`Serialization failed: ${error}`);
    }
};
exports.serializeObject = serializeObject;
const deserializeObject = (value) => {
    try {
        return JSON.parse(value);
    }
    catch (error) {
        throw new Error(`Deserialization failed: ${error}`);
    }
};
exports.deserializeObject = deserializeObject;
//# sourceMappingURL=serilization.js.map