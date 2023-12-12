import Joi from "joi";
import {ApiBearerAuth, ApiProperty, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, HttpStatus, Inject, NotFoundException, Post, Res, UseGuards} from "@nestjs/common";
import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BookingDto} from "../../../dtos/booking.dto";
import {JwtGuard} from "building-blocks/passport/jwt.guard";
import {Response} from "express";
import {IRabbitmqPublisher} from "building-blocks/rabbitmq/rabbitmq-publisher";
import {IFlightClient} from "../../../http-client/services/flight/flight.client";
import {IPassengerClient} from "../../../http-client/services/passenger/passenger-client";
import {IBookingRepository} from "../../../../data/repositories/booking.repository";
import {Booking} from "../../../entities/booking.entity";
import {BookingCreated} from "building-blocks/contracts/booking.contract";
import mapper from "../../../mappings";

export class CreateBooking {
    passengerId: number;
    flightId: number;
    description: string;

    constructor(request: Partial<CreateBooking> = {}) {
        Object.assign(this, request);
    }
}


export class CreateBookingRequestDto {
    @ApiProperty()
    passengerId: number;

    @ApiProperty()
    flightId: number;

    @ApiProperty()
    description: string;

    constructor(request: Partial<CreateBooking> = {}) {
        Object.assign(this, request);
    }
}

const createBookingValidations = Joi.object({
    passengerId: Joi.number().required(),
    flightId: Joi.number().required(),
    description: Joi.string().required()
});

@ApiBearerAuth()
@ApiTags('Bookings')
@Controller({
    path: `/booking`,
    version: '1',
})
export class CreateBookingController {

    constructor(private readonly commandBus: CommandBus) {}

    @Post('create')
    @UseGuards(JwtGuard)
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    @ApiResponse({status: 201, description: 'CREATED'})
    public async createBooking(@Body() request: CreateBookingRequestDto, @Res() res: Response): Promise<BookingDto> {
        const result = await this.commandBus.execute(new CreateBooking(request));

        res.status(HttpStatus.CREATED).send(result);

        return result;
    }
}

@CommandHandler(CreateBooking)
export class CreateBookingHandler implements ICommandHandler<CreateBooking> {

    constructor(
        private readonly commandBus: CommandBus,
        @Inject('IBookingRepository') private bookingRepository: IBookingRepository,
        @Inject('IFlightClient') private flightClient: IFlightClient,
        @Inject('IPassengerClient') private passengerClient: IPassengerClient,
        @Inject('IRabbitmqPublisher') private rabbitmqPublisher: IRabbitmqPublisher
    ) {}

    async execute(command: CreateBooking): Promise<BookingDto> {

        await createBookingValidations.validateAsync(command);

        const flightDto = await this.flightClient.getFlightById(command.flightId);

        const passengerDto = await this.passengerClient.getPassengerById(command.passengerId);

        const avalibaleSeats = await this.flightClient.getAvalibaleSeats(command.flightId);

        if (avalibaleSeats.length == 0) {
            throw new NotFoundException('No seat available!');
        }

        await this.flightClient.reserveSeat({
            seatNumber: avalibaleSeats[0]?.seatNumber,
            flightId: flightDto?.id
        });

        const bookingEntity = await this.bookingRepository.createBooking(
            new Booking({
                seatNumber: avalibaleSeats[0]?.seatNumber,
                flightNumber: flightDto?.flightNumber,
                price: flightDto?.price,
                passengerName: passengerDto?.name,
                description: command?.description,
                flightDate: flightDto?.flightDate,
                aircraftId: flightDto?.aircraftId,
                departureAirportId: flightDto?.departureAirportId,
                arriveAirportId: flightDto?.arriveAirportId
            })
        );

        await this.rabbitmqPublisher.publishMessage(new BookingCreated(bookingEntity));

        const result = mapper.map<Booking, BookingDto>(bookingEntity, new BookingDto());

        return result;

    }
}