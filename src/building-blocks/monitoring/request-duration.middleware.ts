import * as Prometheus from 'prom-client';

const requestDurationHistogram = new Prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'path'],
    buckets: [0.1, 0.5, 1, 2, 5], // Adjust buckets based on your requirements
});

export const requestDurationMiddleware = (err, req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const duration = getDurationInMilliseconds(start);
        const labels = { method: req.method, path: req.path };
        requestDurationHistogram.observe(labels, duration / 1000); // Convert to seconds
    });

    next();
};

function getDurationInMilliseconds(start: [number, number]): number {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;

    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}
