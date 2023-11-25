import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ConflictException,
    ExceptionFilter,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ProblemDocument } from 'http-problem-details';
import { ValidationError } from 'joi';
import ApplicationException from '../types/exeptions/application-exception';
import { serializeObject } from '../utils/serilization';

@Catch()
export class ErrorHandlersFilter implements ExceptionFilter {
    public catch(err: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (err instanceof ApplicationException) {
            const problem = new ProblemDocument({
                type: ApplicationException.name,
                title: err.message,
                detail: err.stack,
                status: err.statusCode,
            });

            response.status(HttpStatus.BAD_REQUEST).json(problem);

            Logger.error(serializeObject(problem));

            return;
        }

        if (err instanceof BadRequestException) {
            const problem = new ProblemDocument({
                type: BadRequestException.name,
                title: err.message,
                detail: err.stack,
                status: err.getStatus(),
            });

            response.status(HttpStatus.BAD_REQUEST).json(problem);

            Logger.error(serializeObject(problem));

            return;
        }

        if (err instanceof UnauthorizedException) {
            const problem = new ProblemDocument({
                type: UnauthorizedException.name,
                title: err.message,
                detail: err.stack,
                status: err.getStatus(),
            });
            response.status(HttpStatus.UNAUTHORIZED).json(problem);

            Logger.error(serializeObject(problem));

            return;
        }

        if (err instanceof ForbiddenException) {
            const problem = new ProblemDocument({
                type: ForbiddenException.name,
                title: err.message,
                detail: err.stack,
                status: err.getStatus(),
            });

            response.status(HttpStatus.FORBIDDEN).json(problem);

            Logger.error(serializeObject(problem));

            return;
        }

        if (err instanceof NotFoundException) {
            const problem = new ProblemDocument({
                type: NotFoundException.name,
                title: err.message,
                detail: err.stack,
                status: err.getStatus(),
            });

            response.status(HttpStatus.NOT_FOUND).json(problem);

            Logger.error(serializeObject(problem));

            return;
        }

        if (err instanceof ConflictException) {
            const problem = new ProblemDocument({
                type: ConflictException.name,
                title: err.message,
                detail: err.stack,
                status: err.getStatus(),
            });

            response.status(HttpStatus.CONFLICT).json(problem);

            Logger.error(serializeObject(problem));

            return;
        }

        if (err instanceof HttpException) {
            const problem = new ProblemDocument({
                type: HttpException.name,
                title: err.message,
                detail: err.stack,
                status: err.getStatus(),
            });

            response.status(HttpStatus.CONFLICT).json(problem);

            Logger.error(serializeObject(problem));

            return;
        }

        if (err instanceof ValidationError) {
            const problem = new ProblemDocument({
                type: ValidationError.name,
                title: err.message,
                detail: err.stack,
                status: HttpStatus.BAD_REQUEST,
            });

            response.status(HttpStatus.BAD_REQUEST).json(problem);

            Logger.error(serializeObject(problem));

            return;
        }

        const problem = new ProblemDocument({
            type: 'INTERNAL_SERVER_ERROR',
            title: err.message,
            detail: err.stack,
            status: err.statusCode || 500,
        });

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(problem);

        Logger.error(serializeObject(problem));

        return;
    }
}
