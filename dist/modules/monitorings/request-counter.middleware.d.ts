import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class RequestCounterMiddleware implements NestMiddleware {
    private requestCounter;
    constructor();
    use(req: Request, res: Response, next: NextFunction): void;
}
