import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OpenTelemetryModule } from '../modules/openTelemetry/openTelemetryModule';
import { RabbitmqModule } from '../modules/rabbitmq/rabbitmqModule';
import { RequestDurationMiddleware } from '../modules/monitorings/requestDurationMiddleware';
import { RequestCounterMiddleware } from '../modules/monitorings/requestCounterMiddleware';
import { RouterModule } from '@nestjs/core';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
    imports: [
        OpenTelemetryModule,
        RabbitmqModule,
        CatalogModule,
        RouterModule.register([
            {
                path: 'catalogs',
                module: CatalogModule,
            },
        ]),
    ],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(RequestCounterMiddleware, RequestDurationMiddleware)
            .forRoutes('*');
    }
}
