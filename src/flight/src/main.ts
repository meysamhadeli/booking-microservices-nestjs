import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {PrometheusMetrics} from "building-blocks/monitoring/prometheus.metrics";
import {ErrorHandlersFilter} from "building-blocks/filters/error-handlers.filter";
import configs from "building-blocks/configs/configs";


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = configs.port || 3344;

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

    PrometheusMetrics.registerMetricsEndpoint(app);

    app.useGlobalFilters(new ErrorHandlersFilter());

    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
