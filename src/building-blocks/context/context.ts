import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {IncomingHttpHeaders} from "http";

@Injectable()
export class HttpContext {
  static request: Request;
  static response: Response;
  static headers: IncomingHttpHeaders;
}


@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

      HttpContext.request = req;

      HttpContext.response = res;

      HttpContext.headers = req.headers;

      next();
  }
}
