"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationException = void 0;
const common_1 = require("@nestjs/common");
class ApplicationException extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = common_1.HttpStatus.BAD_REQUEST, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApplicationException = ApplicationException;
exports.default = ApplicationException;
//# sourceMappingURL=application.exception.js.map