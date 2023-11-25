import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PrometheusMetrics } from './modules/monitorings/prometheus-metrics';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorHandlersFilter } from './filters/error-handlers.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3333;

    app.enableVersioning({
        type: VersioningType.URI,
    });

    const config = new DocumentBuilder()
        .setTitle('booking-microservices-nestjs')
        .setDescription('booking-microservices-nestjs api description')
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
