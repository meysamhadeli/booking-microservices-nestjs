/// <reference types="node" />
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from "http";
export declare class HttpContext {
    static request: Request;
    static response: Response;
    static headers: IncomingHttpHeaders;
}
export declare class HttpContextMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
