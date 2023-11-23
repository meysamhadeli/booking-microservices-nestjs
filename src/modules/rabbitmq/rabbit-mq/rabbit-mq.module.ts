// https://blog.devops.dev/building-a-hopping-good-scalable-event-driven-nest-js-app-with-rabbitmq-5f646717f82d
// rabbit-mq/rabbit-mq.module.ts

import { Module } from '@nestjs/common';
import { RabbitMQPublisher } from './rabbit-mq.publisher';
import { RabbitMQSubscriber } from './rabbit-mq.subscriber';
import { UserCreated } from '../../../events/userCreated';
import { createUserConsumerHandler } from '../../../consumers/createUser';

@Module({
    providers: [
        RabbitMQPublisher,
        {
            provide: RabbitMQSubscriber,
            useFactory: () =>
                new RabbitMQSubscriber(
                    new UserCreated(),
                    createUserConsumerHandler,
                ),
        },
    ],
    exports: [RabbitMQPublisher],
})
export class RabbitMQModule {}
