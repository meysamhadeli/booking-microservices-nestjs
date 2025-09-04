import { Injectable, Logger, LoggerService, LogLevel } from '@nestjs/common';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { logs } from '@opentelemetry/api-logs';

@Injectable()
export class OtelLogger implements LoggerService {
  constructor(private readonly logger: Logger) {}

  debug(message: any, ...optionalParams: any[]): void {
    const msg = this.formatMessage(message, optionalParams);
    this.logger.debug(msg, ...optionalParams);
    this.emit(SeverityNumber.DEBUG, 'DEBUG', msg);
  }

  verbose(message: any, ...optionalParams: any[]): void {
    const msg = this.formatMessage(message, optionalParams);
    this.logger.debug(msg, ...optionalParams);
    this.emit(SeverityNumber.TRACE, 'VERBOSE', msg);
  }

  log(message: any, ...optionalParams: any[]): void {
    const msg = this.formatMessage(message, optionalParams);
    this.logger.debug(msg, ...optionalParams);
    this.emit(SeverityNumber.INFO, 'INFO', msg);
  }

  warn(message: any, ...optionalParams: any[]): void {
    const msg = this.formatMessage(message, optionalParams);
    this.logger.debug(msg, ...optionalParams);
    this.emit(SeverityNumber.WARN, 'WARN', msg);
  }

  error(message: any, ...optionalParams: any[]): void {
    const msg = this.formatMessage(message, optionalParams);
    this.logger.error(msg, ...optionalParams);
    this.emit(SeverityNumber.ERROR, 'ERROR', msg);
  }

  fatal(message: any, ...optionalParams: any[]): void {
    const msg = this.formatMessage(message, optionalParams);
    this.logger.fatal(msg, ...optionalParams);
    this.emit(SeverityNumber.FATAL, 'FATAL', msg);
  }

  setLogLevels(levels: LogLevel[]): void {
    // Optionally store or use these for filtering if needed
  }

  private formatMessage(message: any, optionalParams: any[]): string {
    let msgText = typeof message === 'string' ? message : JSON.stringify(message);
    if (optionalParams && optionalParams.length > 0) {
      msgText +=
        ' ' +
        optionalParams
          .map((param) => (typeof param === 'string' ? param : JSON.stringify(param)))
          .join(' ');
    }
    return msgText;
  }

  private emit(severityNumber: SeverityNumber, severityText: string, msg: string): void {
    const logger = logs.getLogger('booking');
    logger.emit({
      severityNumber,
      severityText,
      body: msg
    });
  }
}
