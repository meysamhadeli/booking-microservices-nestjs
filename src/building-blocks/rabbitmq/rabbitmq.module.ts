import { DynamicModule, Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { RabbitmqPublisher } from './rabbitmq-publisher';
import { RabbitmqConnection, RabbitmqOptions } from './rabbitmq-connection';
import { RabbitmqConsumer } from './rabbitmq-subscriber';
import { OpenTelemetryModule } from '../openTelemetry/opentelemetry.module';

@Global()
@Module({
  imports: [OpenTelemetryModule],
  providers: [
    RabbitmqPublisher,
    {
      provide: 'IRabbitmqConnection',
      useClass: RabbitmqConnection
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
export class RabbitmqModule implements OnApplicationShutdown {
  constructor(private readonly rabbitmqConnection: RabbitmqConnection) {}
  async onApplicationShutdown(signal?: string) {
    await this.rabbitmqConnection.closeConnection();
  }

  static forRoot(options?: RabbitmqOptions): DynamicModule {
    return {
      module: RabbitmqModule,
      providers: [RabbitmqConnection, { provide: RabbitmqOptions, useValue: options }]
    };
  }
}
