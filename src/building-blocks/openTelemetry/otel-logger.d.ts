import { LoggerService, LogLevel } from '@nestjs/common';
export declare class OtelLogger implements LoggerService {
    private readonly nestLogger;
    debug(message: any, ...optionalParams: any[]): void;
    verbose(message: any, ...optionalParams: any[]): void;
    log(message: any, ...optionalParams: any[]): void;
    warn(message: any, ...optionalParams: any[]): void;
    error(message: any, ...optionalParams: any[]): void;
    fatal(message: any, ...optionalParams: any[]): void;
    setLogLevels(_levels: LogLevel[]): void;
    private logWithOtel;
    private formatMessage;
    private emit;
}
