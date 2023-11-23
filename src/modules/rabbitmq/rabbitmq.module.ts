import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitmqService } from './rabbitmq.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'RABBITMQ_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queueOptions: {
                        durable: false,
                    },
                    queue: 'nestjs_queue',
                },
            },
        ]),
    ],
    providers: [RabbitmqService],
    exports: [RabbitmqService], // this line is for exporting RabbitmqService
})
export class RabbitmqModule {}
