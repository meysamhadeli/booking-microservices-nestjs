"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyObject = exports.getTypeName = void 0;
const getTypeName = (instance) => {
    if (instance && instance.constructor) {
        return instance.constructor.name;
    }
    else {
        return typeof instance;
    }
};
exports.getTypeName = getTypeName;
const isEmptyObject = (obj) => Object.keys(obj).length === 0;
exports.isEmptyObject = isEmptyObject;
//# sourceMappingURL=reflection.js.map