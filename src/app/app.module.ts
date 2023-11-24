import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { OpenTelemetryModule } from '../modules/openTelemetry/openTelemetryModule';
import { RabbitmqModule } from '../modules/rabbitmq/rabbitmqModule';
import { RequestDurationMiddleware } from '../modules/monitorings/requestDurationMiddleware';
import { RequestCounterMiddleware } from '../modules/monitorings/requestCounterMiddleware';

@Module({
    imports: [OpenTelemetryModule, RabbitmqModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(RequestCounterMiddleware, RequestDurationMiddleware)
            .forRoutes('*');
    }
}
