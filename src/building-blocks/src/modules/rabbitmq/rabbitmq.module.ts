import { Module } from '@nestjs/common';
import { RabbitmqPublisher } from './rabbitmq-publisher';
import { RabbitmqConnection } from './rabbitmq-connection';
import { OpenTelemetryModule } from '../openTelemetry/open-telemetry.module';

@Module({
  imports: [OpenTelemetryModule],
  providers: [RabbitmqConnection, RabbitmqPublisher],
  exports: [RabbitmqPublisher, RabbitmqConnection]
})
export class RabbitmqModule {}
