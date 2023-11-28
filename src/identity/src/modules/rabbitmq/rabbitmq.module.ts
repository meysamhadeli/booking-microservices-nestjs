import { Module } from '@nestjs/common';
import { RabbitmqPublisher } from './rabbitmq-publisher';
import { RabbitmqSubscriber } from './rabbitmq-subscriber';
import { RabbitmqConnection } from './rabbitmq-connection';
import { OpenTelemetryModule } from '../openTelemetry/open-telemetry.module';
import { OpenTelemetryTracer } from '../openTelemetry/open-telemetry-tracer';
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
