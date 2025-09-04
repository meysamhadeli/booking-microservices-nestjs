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
exports.OtelLogger = void 0;
const common_1 = require("@nestjs/common");
const api_logs_1 = require("@opentelemetry/api-logs");
const api_logs_2 = require("@opentelemetry/api-logs");
let OtelLogger = class OtelLogger {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    debug(message, ...optionalParams) {
        const msg = this.formatMessage(message, optionalParams);
        this.logger.debug(msg, ...optionalParams);
        this.emit(api_logs_1.SeverityNumber.DEBUG, 'DEBUG', msg);
    }
    verbose(message, ...optionalParams) {
        const msg = this.formatMessage(message, optionalParams);
        this.logger.debug(msg, ...optionalParams);
        this.emit(api_logs_1.SeverityNumber.TRACE, 'VERBOSE', msg);
    }
    log(message, ...optionalParams) {
        const msg = this.formatMessage(message, optionalParams);
        this.logger.debug(msg, ...optionalParams);
        this.emit(api_logs_1.SeverityNumber.INFO, 'INFO', msg);
    }
    warn(message, ...optionalParams) {
        const msg = this.formatMessage(message, optionalParams);
        this.logger.debug(msg, ...optionalParams);
        this.emit(api_logs_1.SeverityNumber.WARN, 'WARN', msg);
    }
    error(message, ...optionalParams) {
        const msg = this.formatMessage(message, optionalParams);
        this.logger.error(msg, ...optionalParams);
        this.emit(api_logs_1.SeverityNumber.ERROR, 'ERROR', msg);
    }
    fatal(message, ...optionalParams) {
        const msg = this.formatMessage(message, optionalParams);
        this.logger.fatal(msg, ...optionalParams);
        this.emit(api_logs_1.SeverityNumber.FATAL, 'FATAL', msg);
    }
    setLogLevels(levels) {
    }
    formatMessage(message, optionalParams) {
        let msgText = typeof message === 'string' ? message : JSON.stringify(message);
        if (optionalParams && optionalParams.length > 0) {
            msgText +=
                ' ' + optionalParams.map(param => (typeof param === 'string' ? param : JSON.stringify(param))).join(' ');
        }
        return msgText;
    }
    emit(severityNumber, severityText, msg) {
        const logger = api_logs_2.logs.getLogger("booking");
        logger.emit({
            severityNumber,
            severityText,
            body: msg,
        });
    }
};
exports.OtelLogger = OtelLogger;
exports.OtelLogger = OtelLogger = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [common_1.Logger])
], OtelLogger);
//# sourceMappingURL=otel-logger.js.map