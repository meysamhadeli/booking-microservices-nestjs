import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {TypeOrmModule} from '@nestjs/typeorm';
import {IPassengerRepository, PassengerRepository} from "../data/repositories/passenger.repository";
import {Passenger} from "./entities/passenger.entity";
import {RabbitmqModule} from "building-blocks/rabbitmq/rabbitmq.module";
import {
    GetPassengerByIdController,
    GetPassengerByIdHandler
} from "./features/v1/get-passenger-by-id/get-passenger-by-id";
import {GetPassengersController, GetPassengersHandler} from "./features/v1/get-passengers/get-passengers";
import {OpenTelemetryTracer} from "building-blocks/openTelemetry/open-telemetry-tracer";
import {UserCreated} from "building-blocks/contracts/identity.contract";
import {CreateUserHandler} from "../user/consumers/create-user";
import {IRabbitmqConsumer} from "building-blocks/rabbitmq/rabbitmq-subscriber";


@Module({
    imports: [CqrsModule, RabbitmqModule, TypeOrmModule.forFeature([Passenger])],
    controllers: [GetPassengerByIdController, GetPassengersController],
    providers: [GetPassengerByIdHandler, GetPassengersHandler,
        {
            provide: 'IPassengerRepository',
            useClass: PassengerRepository,
        },
        OpenTelemetryTracer
    ],
    exports: [],
})
export class PassengerModule implements OnApplicationBootstrap {
    constructor(
        @Inject('IRabbitmqConsumer') private readonly rabbitmqConsumer: IRabbitmqConsumer,
        @Inject('IPassengerRepository') private readonly passengerRepository: IPassengerRepository
    ) {
    }

    async onApplicationBootstrap(): Promise<void> {
        await this.rabbitmqConsumer.consumeMessage<UserCreated>(new UserCreated(), new CreateUserHandler(this.passengerRepository).createUserConsumerHandler);
    }
}
