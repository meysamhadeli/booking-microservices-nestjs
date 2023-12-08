import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Airport} from "./entities/airport.entity";
import {AirportRepository} from "../data/repositories/airportRepository";
import {CreateAirportController, CreateAirportHandler} from "./features/v1/create-airport/create-airport";
import {RabbitmqModule} from "building-blocks/rabbitmq/rabbitmq.module";

@Module({
    imports: [CqrsModule, RabbitmqModule, TypeOrmModule.forFeature([Airport])],
    controllers: [CreateAirportController],
    providers: [
        CreateAirportHandler,
        {
            provide: 'IAirportRepository',
            useClass: AirportRepository,
        }
    ],
    exports: [],
})
export class AirportModule {}
