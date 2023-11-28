"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyObject = exports.getTypeName = void 0;
const getTypeName = (instance) => {
    // Check if the instance has a constructor
    if (instance && instance.constructor) {
        // Use the constructor's name property to get the type name
        return instance.constructor.name;
    }
    else {
        // Fallback: Use the typeof operator to get the type name
        return typeof instance;
    }
};
exports.getTypeName = getTypeName;
const isEmptyObject = (obj) => Object.keys(obj).length === 0;
exports.isEmptyObject = isEmptyObject;
//# sourceMappingURL=reflection.js.map