import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as Prometheus from 'prom-client';

@Injectable()
export class RequestCounterMiddleware implements NestMiddleware {
    private requestCounter: Prometheus.Counter;

    constructor() {
        this.requestCounter = new Prometheus.Counter({
            name: 'http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'path', 'status'],
        });
    }

    use(req: Request, res: Response, next: NextFunction) {
        const labels = { method: req.method, path: req.path };

        this.requestCounter.inc(labels);

        res.on('finish', () => {
            this.requestCounter.inc({
                ...labels,
                status: res.statusCode.toString(),
            });
        });

        next();
    }
}
