import Joi from 'joi';
import mapper from '../../../../aircraft/mappings';
import {ISeatRepository} from '../../../../data/repositories/seatRepository';
import {IFlightRepository} from '../../../../data/repositories/flightRepository';
import {ApiBearerAuth, ApiProperty, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, HttpStatus, Inject, NotFoundException, Post, Res, UseGuards} from "@nestjs/common";
import {JwtGuard} from "building-blocks/dist/passport/jwt.guard";
import {Response} from "express";
import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {SeatDto} from "../../../dtos/seat.dto";
import {IRabbitmqPublisher} from "building-blocks/dist/rabbitmq/rabbitmq-publisher";
import {Seat} from "../../../entities/seat.entity";
import {SeatReserved} from "building-blocks/dist/contracts/flight.contract";

export class ReserveSeat {
    seatNumber: string;
    flightId: number;

    constructor(request: Partial<ReserveSeat> = {}) {
        Object.assign(this, request);
    }
}

export class ReserveSeatRequestDto {
    @ApiProperty()
    seatNumber: string;

    @ApiProperty()
    flightId: number;

    constructor(request: Partial<ReserveSeatRequestDto> = {}) {
        Object.assign(this, request);
    }
}

const reserveSeatValidations = Joi.object({
    seatNumber: Joi.string().required(),
    flightId: Joi.number().required()
});

@ApiBearerAuth()
@ApiTags('Seats')
@Controller({
    path: `/seat`,
    version: '1',
})
export class ReserveSeatController {

    constructor(private readonly commandBus: CommandBus) {
    }

    @Post('reserve')
    @UseGuards(JwtGuard)
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    @ApiResponse({status: 204, description: 'NO_CONTENT'})
    public async reserveSeat(@Body() request: ReserveSeatRequestDto, @Res() res: Response): Promise<SeatDto> {
        const result = await this.commandBus.execute(
            new ReserveSeat({
                flightId: request.flightId,
                seatNumber: request.seatNumber
            })
        );

        res.status(HttpStatus.NO_CONTENT).send(result);

        return result;
    }
}

@CommandHandler(ReserveSeat)
export class ReserveSeatHandler implements ICommandHandler<ReserveSeat> {
    constructor(
        @Inject('IRabbitmqPublisher') private readonly rabbitmqPublisher: IRabbitmqPublisher,
        @Inject('IFlightRepository') private readonly flightRepository: IFlightRepository,
        @Inject('ISeatRepository') private readonly seatRepository: ISeatRepository,
    ) {
    }

    async execute(command: ReserveSeat): Promise<SeatDto> {
        await reserveSeatValidations.validateAsync(command);

        const existFlight = await this.flightRepository.findFlightById(command.flightId);

        if (existFlight == null) {
            throw new NotFoundException('Flight not found!');
        }

        const seat = await this.seatRepository.getAvailableSeat(command.flightId, command.seatNumber);

        if (seat == null) {
            throw new NotFoundException('Seat not found!');
        }

        const seatEntity = await this.seatRepository.reserveSeat(
            new Seat({
                id: seat.id,
                flightId: command.flightId,
                seatNumber: command.seatNumber,
                seatClass: seat.seatClass,
                seatType: seat.seatType,
                isReserved: true,
                createdAt: seat.createdAt,
                updatedAt: new Date()
            })
        );

        await this.rabbitmqPublisher.publishMessage(new SeatReserved(seatEntity));

        const result = mapper.map<Seat, SeatDto>(seatEntity, new SeatDto());

        return result;
    }
}
