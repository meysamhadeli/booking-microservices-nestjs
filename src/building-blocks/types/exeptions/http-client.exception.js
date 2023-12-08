"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientException = void 0;
const common_1 = require("@nestjs/common");
class HttpClientException extends Error {
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
exports.HttpClientException = HttpClientException;
exports.default = HttpClientException;
//# sourceMappingURL=http-client.exception.js.map