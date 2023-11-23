import { Module } from '@nestjs/common';
import { RabbitmqPublisher } from './rabbitmq.publisher';
import { RabbitmqSubscriber } from './rabbitmq.subscriber';
import { RabbitmqConnection } from './rabbitmq.connection';
import { UserCreated } from '../../events/userCreated';
import { createUserConsumerHandler } from '../../consumers/createUser';

@Module({
    providers: [
        RabbitmqConnection,
        RabbitmqPublisher,
        {
            provide: RabbitmqSubscriber,
            useFactory: (rabbitMQConnection: RabbitmqConnection) =>
                new RabbitmqSubscriber(
                    rabbitMQConnection,
                    new UserCreated(),
                    createUserConsumerHandler,
                ),
            inject: [RabbitmqConnection],
        },
    ],
    exports: [RabbitmqPublisher],
})
export class RabbitmqModule {}
