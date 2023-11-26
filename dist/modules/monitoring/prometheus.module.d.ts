import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
export declare class PrometheusModule implements NestModule {
    private readonly app;
    constructor(app: NestExpressApplication);
    configure(consumer: MiddlewareConsumer): void;
}
