import {Module} from '@nestjs/common';
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
import {RabbitmqSubscriber} from "building-blocks/rabbitmq/rabbitmq-subscriber";
import {RabbitmqConnection} from "building-blocks/rabbitmq/rabbitmq-connection";
import {OpenTelemetryTracer} from "building-blocks/openTelemetry/open-telemetry-tracer";
import {UserCreated} from "building-blocks/contracts/identity.contract";
import {CreateUserHandler} from "../user/consumers/create-user";


@Module({
    imports: [CqrsModule, RabbitmqModule, TypeOrmModule.forFeature([Passenger])],
    controllers: [GetPassengerByIdController, GetPassengersController],
    providers: [GetPassengerByIdHandler, GetPassengersHandler,
        {
            provide: 'IPassengerRepository',
            useClass: PassengerRepository,
        },
        RabbitmqConnection,
        OpenTelemetryTracer,
        {
            provide: 'RabbitmqSubscriber',
            useFactory: (rabbitmqConnection: RabbitmqConnection, openTelemetryTracer: OpenTelemetryTracer, passengerRepository: IPassengerRepository) => {
                return new RabbitmqSubscriber(rabbitmqConnection, openTelemetryTracer, new UserCreated(), new CreateUserHandler(passengerRepository).createUserConsumerHandler);
            },
            inject: [RabbitmqConnection, OpenTelemetryTracer, 'IPassengerRepository'],
        },
    ],
    exports: [],
})
export class PassengerModule {
}
