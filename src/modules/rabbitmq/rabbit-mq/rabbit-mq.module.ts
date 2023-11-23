// https://blog.devops.dev/building-a-hopping-good-scalable-event-driven-nest-js-app-with-rabbitmq-5f646717f82d
// rabbit-mq/rabbit-mq.module.ts

import { Module } from '@nestjs/common';
import { RabbitMQClient } from './rabbit-mq.client';
import { RabbitMQServer } from './rabbit-mq.server';
import { RabbitMQPublisher } from './rabbit-mq.publisher';
import { RabbitMQSubscriber } from './rabbit-mq.subscriber';

@Module({
    providers: [
        RabbitMQClient,
        RabbitMQServer,
        RabbitMQPublisher,
        RabbitMQSubscriber,
    ],
    exports: [RabbitMQClient, RabbitMQPublisher],
})
export class RabbitMQModule {}
