import { Module } from '@nestjs/common';
import { RabbitmqPublisher } from './rabbitmqPublisher';
import { RabbitmqSubscriber } from './rabbitmqSubscriber';
import { RabbitmqConnection } from './rabbitmqConnection';
import { UserCreated } from '../../events/userCreated';
import { createUserConsumerHandler } from '../../consumers/createUser';
import { OpenTelemetryModule } from '../openTelemetry/openTelemetryModule';
import { OpenTelemetryTracer } from '../openTelemetry/openTelemetryTracer';

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
                    new UserCreated(),
                    createUserConsumerHandler,
                ),
            inject: [RabbitmqConnection, OpenTelemetryTracer],
        },
    ],
    exports: [RabbitmqPublisher],
})
export class RabbitmqModule {}
