import Joi from 'joi';
import {FlightDto} from '../../../dtos/flight.dto';
import {IFlightRepository} from '../../../../data/repositories/flightRepository';
import {ApiBearerAuth, ApiProperty, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FlightStatus} from "../../../enums/flight-status.enum";
import {Body, ConflictException, Controller, HttpStatus, Inject, Post, Res, UseGuards} from "@nestjs/common";
import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Response} from "express";
import {Flight} from "../../../entities/flight.entity";
import {JwtGuard} from "building-blocks/passport/jwt.guard";
import {IRabbitmqPublisher} from "building-blocks/rabbitmq/rabbitmq-publisher";
import {FlightCreated} from "building-blocks/contracts/flight.contract";
import mapper from "../../../mappings";

export class CreateFlight {
    flightNumber: string;
    price: number;
    flightStatus: FlightStatus;
    flightDate: Date;
    departureDate: Date;
    departureAirportId: number;
    aircraftId: number;
    arriveDate: Date;
    arriveAirportId: number;
    durationMinutes: number;

    constructor(request: Partial<CreateFlight> = {}) {
        Object.assign(this, request);
    }
}

export class CreateFlightRequestDto {
    @ApiProperty()
    flightNumber: string;

    @ApiProperty()
    price: number;
    @ApiProperty()
    flightStatus: FlightStatus;

    @ApiProperty()
    flightDate: Date;

    @ApiProperty()
    departureDate: Date;

    @ApiProperty()
    departureAirportId: number;

    @ApiProperty()
    aircraftId: number;

    @ApiProperty()
    arriveDate: Date;

    @ApiProperty()
    arriveAirportId: number;

    @ApiProperty()
    durationMinutes: number;

    constructor(request: Partial<CreateFlightRequestDto> = {}) {
        Object.assign(this, request);
    }
}

const createFlightValidations = Joi.object({
    flightNumber: Joi.string().required(),
    price: Joi.number().required(),
    flightStatus: Joi.string()
        .required()
        .valid(
            FlightStatus.UNKNOWN,
            FlightStatus.DELAY,
            FlightStatus.CANCELED,
            FlightStatus.FLYING,
            FlightStatus.COMPLETED
        ),
    flightDate: Joi.date().required(),
    departureDate: Joi.date().required(),
    departureAirportId: Joi.number().required(),
    aircraftId: Joi.number().required(),
    arriveDate: Joi.date().required(),
    arriveAirportId: Joi.number().required(),
    durationMinutes: Joi.number().required()
});

@ApiBearerAuth()
@ApiTags('Flights')
@Controller({
    path: `/flight`,
    version: '1',
})
export class CreateFlightController {

    constructor(private readonly commandBus: CommandBus) {
    }

    @Post('create')
    @UseGuards(JwtGuard)
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    @ApiResponse({status: 201, description: 'CREATED'})
    public async createFlight(@Body() request: CreateFlightRequestDto, @Res() res: Response): Promise<FlightDto> {
        const result = await this.commandBus.execute(
            new CreateFlight({
                flightNumber: request.flightNumber,
                aircraftId: request.aircraftId,
                arriveAirportId: request.arriveAirportId,
                arriveDate: request.arriveDate,
                price: request.price,
                departureAirportId: request.departureAirportId,
                departureDate: request.departureDate,
                flightDate: request.flightDate,
                flightStatus: request.flightStatus,
                durationMinutes: request.durationMinutes
            })
        );

        res.status(HttpStatus.CREATED).send(result);

        return result;
    }
}

@CommandHandler(CreateFlight)
export class CreateFlightHandler implements ICommandHandler<CreateFlight> {
    constructor(
        @Inject('IRabbitmqPublisher') private readonly rabbitmqPublisher: IRabbitmqPublisher,
        @Inject('IFlightRepository') private readonly flightRepository: IFlightRepository,
    ) {
    }

    async execute(command: CreateFlight): Promise<FlightDto> {
        await createFlightValidations.validateAsync(command);

        const existFlight = await this.flightRepository.findFlightByNumber(command.flightNumber);

        if (existFlight) {
            throw new ConflictException('Flight already taken');
        }

        const flightEntity = await this.flightRepository.createFlight(
            new Flight({
                flightNumber: command.flightNumber,
                aircraftId: command.aircraftId,
                arriveAirportId: command.arriveAirportId,
                arriveDate: command.arriveDate,
                price: command.price,
                departureAirportId: command.departureAirportId,
                departureDate: command.departureDate,
                flightDate: command.flightDate,
                flightStatus: command.flightStatus,
                durationMinutes: command.durationMinutes
            })
        );

        await this.rabbitmqPublisher.publishMessage(new FlightCreated(flightEntity));

        const result = mapper.map<Flight, FlightDto>(flightEntity, new FlightDto());

        return result;
    }
}
