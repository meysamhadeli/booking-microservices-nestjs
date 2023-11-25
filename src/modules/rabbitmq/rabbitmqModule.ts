import { Module } from '@nestjs/common';
import { RabbitmqPublisher } from './rabbitmqPublisher';
import { RabbitmqSubscriber } from './rabbitmqSubscriber';
import { RabbitmqConnection } from './rabbitmqConnection';
import { OpenTelemetryModule } from '../openTelemetry/openTelemetryModule';
import { OpenTelemetryTracer } from '../openTelemetry/openTelemetryTracer';
import { createCatalogConsumerHandler } from '../../consumers/create-catalog';
import { CatalogCreated } from '../../contracts/catalog.contracts';

@Module({
    imports: [OpenTelemetryModule],
    providers: [
        RabbitmqConnection,
        RabbitmqPublisher,
        {
            provide: RabbitmqSubscriber,
            useFactory: (
                rabbitMQConnection: RabbitmqConnection,
                openTelemetryTracer: OpenTelemetryTracer,
            ) =>
                new RabbitmqSubscriber(
                    rabbitMQConnection,
                    openTelemetryTracer,
                    new CatalogCreated(),
                    createCatalogConsumerHandler,
                ),
            inject: [RabbitmqConnection, OpenTelemetryTracer],
        },
    ],
    exports: [RabbitmqPublisher],
})
export class RabbitmqModule {}
