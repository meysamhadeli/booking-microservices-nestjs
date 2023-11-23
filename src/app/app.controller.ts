// app.controller.ts

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitMQClient } from '../modules/rabbitmq/rabbit-mq/rabbit-mq.client';
import { RabbitMQPublisher } from '../modules/rabbitmq/rabbit-mq/rabbit-mq.publisher';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly rabbitMQClient: RabbitMQClient,
        private readonly rabbitMQPublisher: RabbitMQPublisher,
    ) {}

    @Get()
    async getHello(): Promise<string> {
        const message = 'Hello RabbitMQ!';
        const response = await this.rabbitMQClient.sendMessage(
            'rpc_queue',
            message,
        );

        const pubsubMessage = 'A hopping-good time!';
        this.rabbitMQPublisher.publishMessage(
            'pubsub_exchange',
            'pubsub_key',
            pubsubMessage,
        );

        return response;
    }
}
