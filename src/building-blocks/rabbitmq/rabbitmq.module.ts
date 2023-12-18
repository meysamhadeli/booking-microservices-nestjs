import {DynamicModule, Global, Module} from '@nestjs/common';
import {RabbitmqPublisher} from './rabbitmq-publisher';
import {RabbitmqConnection, RabbitmqOptions} from './rabbitmq-connection';
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
export class RabbitmqModule {
  static forRoot(options?: RabbitmqOptions): DynamicModule {
    return {
      module: RabbitmqModule,
      providers: [RabbitmqConnection, { provide: RabbitmqOptions, useValue: options }]
    };
  }
}
