import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {PrometheusMetrics} from "building-blocks/monitoring/prometheus.metrics";
import {ErrorHandlersFilter} from "building-blocks/filters/error-handlers.filter";
import configs from "building-blocks/configs/configs";
import {Request, Response} from "express";


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableShutdownHooks();

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = configs.port || 3366;

    app.enableVersioning({
        type: VersioningType.URI,
    });

    const config = new DocumentBuilder()
        .setTitle(`${configs.serviceName}`)
        .setDescription(`${configs.serviceName} api description`)
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    app.use((req: Request, res: Response, next: any) => {
        if (req.originalUrl == '/' || req.originalUrl.includes('favicon.ico')) {
            return res.send(configs.serviceName);
        }
        return next();
    });

    PrometheusMetrics.registerMetricsEndpoint(app);

    app.useGlobalFilters(new ErrorHandlersFilter());

    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
