import Joi from 'joi';
import {FlightDto} from '../../../dtos/flight.dto';
import {IFlightRepository} from '../../../../data/repositories/flightRepository';
import mapper from '../../../mappings';
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Inject, NotFoundException, Query, UseGuards} from "@nestjs/common";
import {IQueryHandler, QueryBus, QueryHandler} from "@nestjs/cqrs";
import {Flight} from "../../../entities/flight.entity";
import {JwtGuard} from "building-blocks/passport/jwt.guard";
import {IRabbitmqPublisher} from "building-blocks/rabbitmq/rabbitmq-publisher";

export class GetFlightById {
    id: number;

    constructor(request: Partial<GetFlightById> = {}) {
        Object.assign(this, request);
    }
}

const getFlightByIdValidations = {
    params: Joi.object().keys({
        id: Joi.number().required()
    })
};

@ApiBearerAuth()
@ApiTags('Flights')
@Controller({
    path: `/flight`,
    version: '1',
})
export class GetFlightByIdController {

    constructor(private readonly queryBus: QueryBus) {
    }

    @Get('get-by-id')
    @UseGuards(JwtGuard)
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    @ApiResponse({status: 200, description: 'OK'})
    public async getFlightById(@Query() id: number): Promise<FlightDto> {
        const result = await this.queryBus.execute(
            new GetFlightById({
                id: id
            })
        );

        if (!result) {
            throw new NotFoundException('Flight not found');
        }
        return result;
    }
}

@QueryHandler(GetFlightById)
export class GetFlightByIdHandler implements IQueryHandler<GetFlightById> {
    constructor(
        @Inject('IRabbitmqPublisher') private readonly rabbitmqPublisher: IRabbitmqPublisher,
        @Inject('IFlightRepository') private readonly flightRepository: IFlightRepository,
    ) {
    }

    async execute(query: GetFlightById): Promise<FlightDto> {
        await getFlightByIdValidations.params.validateAsync(query);

        const flightEntity = await this.flightRepository.findFlightById(query.id);

        const result = mapper.map<Flight, FlightDto>(flightEntity, new FlightDto());

        return result;
    }
}
