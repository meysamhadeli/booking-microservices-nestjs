import {DynamicModule, Global, Inject, Module, OnApplicationShutdown} from '@nestjs/common';
import {IRabbitmqPublisher, RabbitmqPublisher} from './rabbitmq-publisher';
import {IRabbitmqConnection, RabbitmqConnection, RabbitmqOptions} from './rabbitmq-connection';
import {OpenTelemetryModule} from '../openTelemetry/open-telemetry.module';
import {RabbitmqConsumer} from "./rabbitmq-subscriber";

@Global()
@Module({
  imports: [OpenTelemetryModule.forRoot()],
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
