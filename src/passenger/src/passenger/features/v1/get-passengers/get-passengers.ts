import Joi from 'joi';
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Inject, Query, UseGuards} from "@nestjs/common";
import {IQueryHandler, QueryBus, QueryHandler} from "@nestjs/cqrs";
import {JwtGuard} from "building-blocks/passport/jwt.guard";
import {PassengerDto} from "../../../dtos/passenger.dto";
import {IPassengerRepository} from "../../../../data/repositories/passenger.repository";
import {PagedResult} from "building-blocks/types/pagination/paged-result";
import mapper from "../../../mappings";
import {Passenger} from "../../../entities/passenger.entity";

export class GetPassengers {
    page = 1;
    pageSize = 10;
    orderBy = 'id';
    order: 'ASC' | 'DESC' = 'ASC';
    searchTerm?: string = null;

    constructor(request: Partial<GetPassengers> = {}) {
        Object.assign(this, request);
    }
}

const getPassengersValidations = Joi.object<GetPassengers>({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).default(10),
    orderBy: Joi.string().valid('id', 'name', 'email').default('id'),
    order: Joi.string().valid('ASC', 'DESC').default('ASC'),
    searchTerm: Joi.string().allow(null).optional()
});

@ApiBearerAuth()
@ApiTags('Passengers')
@Controller({
    path: `/passenger`,
    version: '1',
})
export class GetPassengersController {

    constructor(private readonly queryBus: QueryBus) {
    }
    @Get('get-all')
    @UseGuards(JwtGuard)
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    public async getPassengers(
        @Query() pageSize = 10,
        @Query() page = 1,
        @Query() order: 'ASC' | 'DESC' = 'ASC',
        @Query() orderBy = 'id',
        @Query() searchTerm?: string
    ): Promise<PassengerDto[]> {
        const result = await this.queryBus.execute(
            new GetPassengers({
                page: page,
                pageSize: pageSize,
                searchTerm: searchTerm,
                order: order,
                orderBy: orderBy
            })
        );

        return result;
    }
}

@QueryHandler(GetPassengers)
export class GetPassengersHandler implements IQueryHandler<GetPassengers> {
    constructor(@Inject('IPassengerRepository') private readonly passengerRepository: IPassengerRepository) {}

    async execute(query: GetPassengers): Promise<PagedResult<PassengerDto[]>> {
        await getPassengersValidations.validateAsync(query);

        const [passengersEntity, total] = await this.passengerRepository.findPassengers(
            query.page,
            query.pageSize,
            query.orderBy,
            query.order,
            query.searchTerm
        );

        if (passengersEntity?.length == 0) return new PagedResult<PassengerDto[]>(null, total);

        const result = passengersEntity.map((user) =>
            mapper.map<Passenger, PassengerDto>(user, new PassengerDto())
        );

        return new PagedResult<PassengerDto[]>(result, total);
    }
}
