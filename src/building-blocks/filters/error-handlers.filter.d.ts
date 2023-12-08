import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class ErrorHandlersFilter implements ExceptionFilter {
    catch(err: any, host: ArgumentsHost): any;
}
