"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.password = void 0;
const common_1 = require("@nestjs/common");
const password = (value) => {
    if (value.length < 8) {
        throw new common_1.BadRequestException('password must be at least 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new common_1.BadRequestException('password must contain at least 1 letter and 1 number');
    }
    return value;
};
exports.password = password;
//# sourceMappingURL=validation.js.map