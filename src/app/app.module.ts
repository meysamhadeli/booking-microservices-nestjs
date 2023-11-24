// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OpenTelemetryModule } from '../modules/openTelemetry/openTelemetryModule';
import { RabbitmqModule } from '../modules/rabbitmq/rabbitmqModule';

@Module({
    imports: [OpenTelemetryModule, RabbitmqModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
