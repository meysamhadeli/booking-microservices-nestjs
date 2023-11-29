import Joi from 'joi';
import mapper from '../../../mappings';
import { ISeatRepository } from '../../../../data/repositories/seatRepository';
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Inject, Post, Query, UseGuards} from "@nestjs/common";
import {JwtGuard} from "building-blocks/dist/passport/jwt.guard";
import {IQueryHandler, QueryBus, QueryHandler} from "@nestjs/cqrs";
import {SeatDto} from "../../../dtos/seat.dto";
import {IRabbitmqPublisher} from "building-blocks/dist/rabbitmq/rabbitmq-publisher";
import {Seat} from "../../../entities/seat.entity";

export class GetAvailableSeats {
  flightId: number;

  constructor(request: Partial<GetAvailableSeats> = {}) {
    Object.assign(this, request);
  }
}

const getAvailableSeatsValidations = {
  params: Joi.object().keys({
    flightId: Joi.number().required()
  })
};

@ApiBearerAuth()
@ApiTags('Seats')
@Controller({
    path: `/seat`,
    version: '1',
})
export class GetAvailableSeatsController {

    constructor(private readonly queryBus: QueryBus) {
    }
  @Get('get-available-seats')
  @Post('create')
  @UseGuards(JwtGuard)
  @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
  @ApiResponse({status: 400, description: 'BAD_REQUEST'})
  @ApiResponse({status: 403, description: 'FORBIDDEN'})
  @ApiResponse({status: 200, description: 'OK'})
  public async getAvailableSeats(@Query() flightId: number): Promise<SeatDto[]> {
    const result = await this.queryBus.execute(
      new GetAvailableSeats({
        flightId: flightId
      })
    );

    return result;
  }
}

@QueryHandler(GetAvailableSeats)
export class GetAvailableSeatsHandler implements IQueryHandler<GetAvailableSeats> {
    constructor(
        @Inject('IRabbitmqPublisher') private readonly rabbitmqPublisher: IRabbitmqPublisher,
        @Inject('ISeatRepository') private readonly seatRepository: ISeatRepository,
    ) {
    }

    async execute(query: GetAvailableSeats): Promise<SeatDto[]> {
    await getAvailableSeatsValidations.params.validateAsync(query);

    const seatsEntity = await this.seatRepository.getSeatsByFlightId(query.flightId);

    const result = seatsEntity.map((seat) => mapper.map<Seat, SeatDto>(seat, new SeatDto()));

    return result;
  }
}
