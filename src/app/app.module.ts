import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitmqModule } from '../modules/rabbitmq/rabbitmq.module';

@Module({
    imports: [RabbitmqModule],

    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
