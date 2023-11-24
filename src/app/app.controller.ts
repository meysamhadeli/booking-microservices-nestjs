// app.controller.ts

import { Controller, Get } from '@nestjs/common';
import { RabbitmqPublisher } from '../modules/rabbitmq/rabbitmqPublisher';
import { UserCreated } from '../events/userCreated';

@Controller()
export class AppController {
    constructor(
        private readonly rabbitMQPublisher: RabbitmqPublisher,
    ) {}

    @Get()
    async publishSampleMessage(): Promise<void> {
        await this.rabbitMQPublisher.publishMessage(
            new UserCreated({ id: 1, name: 'meysam' }),
        );
    }
}
