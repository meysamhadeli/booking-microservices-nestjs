import { Module } from '@nestjs/common';
import { RabbitmqPublisher } from './rabbitmq-publisher';
import { RabbitmqConnection } from './rabbitmq-connection';
import { OpenTelemetryModule } from '../openTelemetry/open-telemetry.module';
import {RabbitmqConsumer} from "./rabbitmq-subscriber";

@Module({
  imports: [OpenTelemetryModule],
  providers: [
    RabbitmqConnection,
    RabbitmqPublisher,
    {
      provide: 'IRabbitmqConnection',
      useClass: RabbitmqConnection,
    },
    {
      provide: 'IRabbitmqPublisher',
      useClass: RabbitmqPublisher
    },
    {
      provide: 'IRabbitmqConsumer',
      useClass: RabbitmqConsumer
    }
  ],
  exports: ['IRabbitmqConnection', 'IRabbitmqPublisher', 'IRabbitmqConsumer']
})
export class RabbitmqModule {}
