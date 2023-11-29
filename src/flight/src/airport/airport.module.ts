import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RabbitmqModule} from "building-blocks/dist/rabbitmq/rabbitmq.module";
import {Airport} from "./entities/airport.entity";
import {AirportRepository} from "../data/repositories/airportRepository";
import {CreateAirportController, CreateAirportHandler} from "./features/v1/create-airport/create-airport";

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
