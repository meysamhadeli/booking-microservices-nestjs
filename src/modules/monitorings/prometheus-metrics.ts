import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from 'express';
import * as Prometheus from 'prom-client';

@Injectable()
export class PrometheusMetrics {
    static registerMetricsEndpoint(app: any) {
        app.use('/metrics', async (req: Request, res: Response) => {
            try {
                const metrics = await Prometheus.register.metrics();
                res.set('Content-Type', Prometheus.register.contentType);
                res.end(metrics);
            } catch (error) {
                Logger.error('Error generating metrics:', error);
                res.status(500).end();
            }
        });
    }
}
