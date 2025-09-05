"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtelLogger = void 0;
const common_1 = require("@nestjs/common");
const api_logs_1 = require("@opentelemetry/api-logs");
const api_logs_2 = require("@opentelemetry/api-logs");
const configs_1 = __importDefault(require("../configs/configs"));
let OtelLogger = class OtelLogger {
    nestLogger = new common_1.Logger();
    debug(message, ...optionalParams) {
        this.logWithOtel(api_logs_1.SeverityNumber.DEBUG, 'DEBUG', message, optionalParams);
    }
    verbose(message, ...optionalParams) {
        this.logWithOtel(api_logs_1.SeverityNumber.TRACE, 'VERBOSE', message, optionalParams);
    }
    log(message, ...optionalParams) {
        this.logWithOtel(api_logs_1.SeverityNumber.INFO, 'INFO', message, optionalParams);
    }
    warn(message, ...optionalParams) {
        this.logWithOtel(api_logs_1.SeverityNumber.WARN, 'WARN', message, optionalParams);
    }
    error(message, ...optionalParams) {
        this.logWithOtel(api_logs_1.SeverityNumber.ERROR, 'ERROR', message, optionalParams);
    }
    fatal(message, ...optionalParams) {
        this.logWithOtel(api_logs_1.SeverityNumber.FATAL, 'FATAL', message, optionalParams);
    }
    setLogLevels(_levels) {
    }
    logWithOtel(severityNumber, severityText, message, optionalParams = []) {
        const formattedMessage = this.formatMessage(message, optionalParams);
        switch (severityText) {
            case 'ERROR':
                this.nestLogger.error(formattedMessage, ...optionalParams);
                break;
            case 'WARN':
                this.nestLogger.warn(formattedMessage, ...optionalParams);
                break;
            case 'DEBUG':
                this.nestLogger.debug(formattedMessage, ...optionalParams);
                break;
            case 'VERBOSE':
                this.nestLogger.verbose(formattedMessage, ...optionalParams);
                break;
            case 'FATAL':
                this.nestLogger.error(`[FATAL] ${formattedMessage}`, ...optionalParams);
                break;
            default:
                this.nestLogger.log(formattedMessage, ...optionalParams);
        }
        this.emit(severityNumber, severityText, message, optionalParams);
    }
    formatMessage(message, optionalParams) {
        let msgText = message instanceof Error
            ? `${message.message}\n${message.stack}`
            : typeof message === 'string'
                ? message
                : JSON.stringify(message);
        if (optionalParams?.length > 0) {
            msgText +=
                ' ' +
                    optionalParams
                        .map((param) => param instanceof Error
                        ? `${param.message}\n${param.stack}`
                        : typeof param === 'string'
                            ? param
                            : JSON.stringify(param))
                        .join(' ');
        }
        return msgText;
    }
    emit(severityNumber, severityText, message, optionalParams) {
        try {
            const logger = api_logs_2.logs.getLogger(configs_1.default.opentelemetry?.serviceName || 'default-service', configs_1.default.opentelemetry?.serviceVersion || '1.0.0');
            const body = this.formatMessage(message, optionalParams);
            const attributes = optionalParams.reduce((attrs, param, idx) => {
                if (param === null || param === undefined) {
                    attrs[`meta_${idx}`] = 'null';
                }
                else if (param instanceof Error) {
                    attrs[`meta_${idx}`] = `${param.message}\n${param.stack}`;
                }
                else if (typeof param === 'object') {
                    Object.entries(param).forEach(([k, v]) => {
                        attrs[k] =
                            v === null || v === undefined
                                ? 'null'
                                : typeof v === 'object'
                                    ? JSON.stringify(v)
                                    : String(v);
                    });
                }
                else {
                    attrs[`meta_${idx}`] = String(param);
                }
                return attrs;
            }, {});
            logger.emit({
                severityNumber,
                severityText,
                body,
                attributes
            });
        }
        catch (err) {
            this.nestLogger.error('OpenTelemetry log emission failed:', err);
        }
    }
};
exports.OtelLogger = OtelLogger;
exports.OtelLogger = OtelLogger = __decorate([
    (0, common_1.Injectable)()
], OtelLogger);
//# sourceMappingURL=otel-logger.js.map