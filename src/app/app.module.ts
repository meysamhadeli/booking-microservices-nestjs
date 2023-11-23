// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from '../modules/rabbitmq/rabbit-mq/rabbit-mq.module';

@Module({
    imports: [RabbitMQModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
