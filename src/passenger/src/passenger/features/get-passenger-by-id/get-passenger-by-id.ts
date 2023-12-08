import Joi from 'joi';
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtGuard} from "building-blocks/passport/jwt.guard";
import {Controller, Get, Inject, NotFoundException, Query, UseGuards} from "@nestjs/common";
import {IQueryHandler, QueryBus, QueryHandler} from "@nestjs/cqrs";
import {PassengerDto} from "../../dtos/passenger.dto";
import {IPassengerRepository} from "../../../data/repositories/passenger.repository";
import {Passenger} from "../../entities/passenger.entity";
import mapper from "../../mappings";

export class GetPassengerById {
    id: number;

    constructor(request: Partial<GetPassengerById> = {}) {
        Object.assign(this, request);
    }
}

const getPassengerByIdValidations = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    })
};

@ApiBearerAuth()
@ApiTags('Passengers')
@Controller({
    path: `/passenger`,
    version: '1',
})
export class GetPassengerByIdController {

    constructor(private readonly queryBus: QueryBus) {
    }
    @Get('get-by-id')
    @UseGuards(JwtGuard)
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    public async getPassengerById(@Query() id: number): Promise<PassengerDto> {
        const result = await this.queryBus.execute(
            new GetPassengerById({
                id: id
            })
        );

        if (!result) {
            throw new NotFoundException('Passenger not found');
        }
        return result;
    }
}

@QueryHandler(GetPassengerById)
export class GetPassengerByIdHandler implements IQueryHandler<GetPassengerById> {
    constructor(@Inject('IPassengerRepository') private readonly passengerRepository: IPassengerRepository) {}

    async execute(query: GetPassengerById): Promise<PassengerDto> {
        await getPassengerByIdValidations.params.validateAsync(query);

        const passengerEntity = await this.passengerRepository.findPassengerById(query.id);

        const result = mapper.map<Passenger, PassengerDto>(passengerEntity, new PassengerDto());

        return result;
    }
}
