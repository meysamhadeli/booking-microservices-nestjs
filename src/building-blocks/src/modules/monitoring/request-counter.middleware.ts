import * as Prometheus from 'prom-client';

const requestCounter = new Prometheus.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status'],
});

const errorCounter = new Prometheus.Counter({
    name: 'http_errors_total',
    help: 'Total number of HTTP errors',
    labelNames: ['method', 'path', 'status'],
});

export const requestCounterMiddleware = (err, req, res, next) => {
    const labels = { method: req.method, path: req.path };

    requestCounter.inc(labels);

    res.on('finish', () => {
        const status = res.statusCode.toString();

        requestCounter.inc({
            ...labels,
            status,
        });

        // Check if the status code represents an error (4xx or 5xx)
        if (status.startsWith('4') || status.startsWith('5')) {
            errorCounter.inc({
                ...labels,
                status,
            });
        }
    });

    next();
};
