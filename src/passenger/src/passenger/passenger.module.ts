import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PassengerRepository} from "../data/repositories/passenger.repository";
import {Passenger} from "./entities/passenger.entity";
import {RabbitmqModule} from "building-blocks/rabbitmq/rabbitmq.module";
import {GetPassengerById, GetPassengerByIdController} from "./features/get-passenger-by-id/get-passenger-by-id";
import {GetPassengers, GetPassengersController} from "./features/get-passengers/get-passengers";
import {RabbitmqSubscriber} from "building-blocks/rabbitmq/rabbitmq-subscriber";
import {ConfigService} from "@nestjs/config";
import {RabbitmqConnection} from "building-blocks/rabbitmq/rabbitmq-connection";
import {OpenTelemetryTracer} from "building-blocks/openTelemetry/open-telemetry-tracer";
import {UserCreated} from "building-blocks/contracts/identity.contract";
import {createUserConsumerHandler} from "../user/consumers/create-user";
import {number, string} from "yup";



@Module({
    imports: [CqrsModule, RabbitmqModule, TypeOrmModule.forFeature([Passenger])],
    controllers: [GetPassengerByIdController, GetPassengersController],
    providers: [ GetPassengerById, GetPassengers,
        {
            provide: 'IPassengerRepository',
            useClass: PassengerRepository,
        },
        RabbitmqConnection,
        OpenTelemetryTracer,
        {
            provide: 'RabbitmqSubscriber',
            useFactory: (rabbitmqConnection: RabbitmqConnection, openTelemetryTracer: OpenTelemetryTracer) => {
                return new RabbitmqSubscriber(rabbitmqConnection, openTelemetryTracer, new UserCreated(), createUserConsumerHandler);
            },
            inject: [RabbitmqConnection, OpenTelemetryTracer],
        },
    ],
    exports: [],
})
export class PassengerModule {}
