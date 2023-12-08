import Joi from 'joi';
import mapper from '../../../../aircraft/mappings';
import {ISeatRepository} from '../../../../data/repositories/seatRepository';
import {IFlightRepository} from '../../../../data/repositories/flightRepository';
import {ApiBearerAuth, ApiProperty, ApiResponse, ApiTags} from "@nestjs/swagger";
import {SeatClass} from "../../../enums/seat-class.enum";
import {SeatType} from "../../../enums/seat-type.enum";
import {Body, Controller, HttpStatus, Inject, NotFoundException, Post, Res, UseGuards} from "@nestjs/common";
import {SeatDto} from "../../../dtos/seat.dto";
import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Response} from "express";
import {Seat} from "../../../entities/seat.entity";
import {JwtGuard} from "building-blocks/passport/jwt.guard";
import {IRabbitmqPublisher} from "building-blocks/rabbitmq/rabbitmq-publisher";
import {SeatCreated} from "building-blocks/contracts/flight.contract";

export class CreateSeat {
    seatNumber: string;
    seatClass: SeatClass;
    seatType: SeatType;
    flightId: number;

    constructor(request: Partial<CreateSeat> = {}) {
        Object.assign(this, request);
    }
}

export class CreateSeatRequestDto {
    @ApiProperty()
    seatNumber: string;

    @ApiProperty()
    seatClass: SeatClass;

    @ApiProperty()
    seatType: SeatType;

    @ApiProperty()
    flightId: number;

    constructor(request: Partial<CreateSeatRequestDto> = {}) {
        Object.assign(this, request);
    }
}

const createSeatValidations = Joi.object({
    seatNumber: Joi.string().required(),
    flightId: Joi.number().required(),
    seatClass: Joi.string()
        .required()
        .valid(SeatClass.UNKNOWN, SeatClass.FIRST_CLASS, SeatClass.BUSINESS, SeatClass.ECONOMY),
    seatType: Joi.string()
        .required()
        .valid(SeatType.UNKNOWN, SeatType.AISLE, SeatType.MIDDLE, SeatType.WINDOW)
});

@ApiBearerAuth()
@ApiTags('Seats')
@Controller({
    path: `/seat`,
    version: '1',
})
export class CreateSeatController {

    constructor(private readonly commandBus: CommandBus) {
    }

    @Post('create')
    @UseGuards(JwtGuard)
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    @ApiResponse({status: 201, description: 'CREATED'})
    public async createSeat(@Body() request: CreateSeatRequestDto, @Res() res: Response): Promise<SeatDto> {
        const result = await this.commandBus.execute(
            new CreateSeat({
                flightId: request.flightId,
                seatNumber: request.seatNumber,
                seatClass: request.seatClass,
                seatType: request.seatType
            })
        );

        res.status(HttpStatus.CREATED).send(result);
        return result;
    }
}

@CommandHandler(CreateSeat)
export class CreateSeatHandler implements ICommandHandler<CreateSeat> {
    constructor(
        @Inject('IRabbitmqPublisher') private readonly rabbitmqPublisher: IRabbitmqPublisher,
        @Inject('ISeatRepository') private readonly seatRepository: ISeatRepository,
        @Inject('IFlightRepository') private readonly flightRepository: IFlightRepository,
    ) {
    }

    async execute(command: CreateSeat): Promise<SeatDto> {
        await createSeatValidations.validateAsync(command);

        const existFlight = await this.flightRepository.findFlightById(command.flightId);

        if (existFlight == null) {
            throw new NotFoundException('Flight not found!');
        }

        const seatEntity = await this.seatRepository.createSeat(
            new Seat({
                flightId: command.flightId,
                seatNumber: command.seatNumber,
                seatClass: command.seatClass,
                seatType: command.seatType,
                isReserved: false
            })
        );

        await this.rabbitmqPublisher.publishMessage(new SeatCreated(seatEntity));

        const result = mapper.map<Seat, SeatDto>(seatEntity, new SeatDto());

        return result;
    }
}
