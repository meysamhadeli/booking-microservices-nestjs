import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OpenTelemetryModule } from '../modules/openTelemetry/open-telemetry.module';
import { RabbitmqModule } from '../modules/rabbitmq/rabbitmq.module';
import { RequestDurationMiddleware } from '../modules/monitorings/request-duration.middleware';
import { RequestCounterMiddleware } from '../modules/monitorings/request-counter.middleware';
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
