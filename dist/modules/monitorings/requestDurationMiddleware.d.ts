import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class RequestDurationMiddleware implements NestMiddleware {
    private requestDurationHistogram;
    constructor();
    use(req: Request, res: Response, next: NextFunction): void;
    private getDurationInMilliseconds;
}
