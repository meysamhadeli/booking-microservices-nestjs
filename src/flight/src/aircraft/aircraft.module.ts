import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RabbitmqModule} from "building-blocks/dist/rabbitmq/rabbitmq.module";
import {Aircraft} from "./entities/aircraft.entity";
import {AircraftRepository} from "../data/repositories/aircraftRepository";
import {CreateAircraftController, CreateAircraftHandler} from "./features/v1/create-aircraft/create-aircraft";

@Module({
    imports: [CqrsModule, RabbitmqModule, TypeOrmModule.forFeature([Aircraft])],
    controllers: [CreateAircraftController],
    providers: [
        CreateAircraftHandler,
        {
            provide: 'IAircraftRepository',
            useClass: AircraftRepository,
        }
    ],
    exports: [],
})
export class AircraftModule {}
