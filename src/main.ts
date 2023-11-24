import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PrometheusMetrics } from './modules/monitorings/prometheusMetrics';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    PrometheusMetrics.registerMetricsEndpoint(app);

    await app.listen(3400);
}
bootstrap();
