import { RabbitmqPublisher } from '../modules/rabbitmq/rabbitmqPublisher';
export declare class AppController {
    private readonly rabbitMQPublisher;
    constructor(rabbitMQPublisher: RabbitmqPublisher);
    publishSampleMessage(): Promise<void>;
}
