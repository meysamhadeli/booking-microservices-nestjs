import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { serializeObject } from '../../utils/serilization';
import { Observable } from 'rxjs';

@Injectable()
export class RabbitmqService {
    constructor(
        @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    ) {}

    async publishMessage<T>(message: T): Promise<Observable<string>> {
        const serializedMessage = serializeObject(message);

        return this.client.emit<string>('message', serializedMessage);
    }
}
