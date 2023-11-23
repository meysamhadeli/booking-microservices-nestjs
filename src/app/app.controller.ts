// app.controller.ts

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitmqPublisher } from '../modules/rabbitmq/rabbitmq.publisher';
import { UserCreated } from '../events/userCreated';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly rabbitMQPublisher: RabbitmqPublisher,
    ) {}

    @Get()
    async publishSampleMessage(): Promise<void> {
        await this.rabbitMQPublisher.publishMessage(
            new UserCreated({ id: 1, name: 'meysam' }),
        );
    }
}
