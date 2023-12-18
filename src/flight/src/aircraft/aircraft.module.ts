import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Aircraft} from "./entities/aircraft.entity";
import {AircraftRepository} from "../data/repositories/aircraftRepository";
import {CreateAircraftController, CreateAircraftHandler} from "./features/v1/create-aircraft/create-aircraft";
import {RabbitmqModule} from "building-blocks/rabbitmq/rabbitmq.module";

@Module({
    imports: [CqrsModule, RabbitmqModule.forRoot(), TypeOrmModule.forFeature([Aircraft])],
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
