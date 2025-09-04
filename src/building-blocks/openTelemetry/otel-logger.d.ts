import { Logger, LoggerService, LogLevel } from '@nestjs/common';
export declare class OtelLogger implements LoggerService {
    private readonly logger;
    constructor(logger: Logger);
    debug(message: any, ...optionalParams: any[]): void;
    verbose(message: any, ...optionalParams: any[]): void;
    log(message: any, ...optionalParams: any[]): void;
    warn(message: any, ...optionalParams: any[]): void;
    error(message: any, ...optionalParams: any[]): void;
    fatal(message: any, ...optionalParams: any[]): void;
    setLogLevels(levels: LogLevel[]): void;
    private formatMessage;
    private emit;
}
