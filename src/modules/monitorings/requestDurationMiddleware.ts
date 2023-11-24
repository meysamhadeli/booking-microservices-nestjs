import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as Prometheus from 'prom-client';

@Injectable()
export class RequestDurationMiddleware implements NestMiddleware {
    private requestDurationHistogram: Prometheus.Histogram;

    constructor() {
        this.requestDurationHistogram = new Prometheus.Histogram({
            name: 'http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'path'],
            buckets: [0.1, 0.5, 1, 2, 5], // Adjust buckets based on your requirements
        });
    }

    use(req: Request, res: Response, next: NextFunction) {
        const start = process.hrtime();

        res.on('finish', () => {
            const duration = this.getDurationInMilliseconds(start);
            const labels = { method: req.method, path: req.path };
            this.requestDurationHistogram.observe(labels, duration / 1000); // Convert to seconds
        });

        next();
    }

    private getDurationInMilliseconds(start: [number, number]): number {
        const NS_PER_SEC = 1e9;
        const NS_TO_MS = 1e6;

        const diff = process.hrtime(start);
        return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
    }
}
