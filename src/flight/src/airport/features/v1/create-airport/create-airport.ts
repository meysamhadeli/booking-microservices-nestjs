import Joi from 'joi';
import {IAirportRepository} from '../../../../data/repositories/airportRepository';
import mapper from '../../../../aircraft/mappings';
import {ApiBearerAuth, ApiProperty, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, ConflictException, Controller, HttpStatus, Inject, Post, Res, UseGuards} from "@nestjs/common";
import {JwtGuard} from "building-blocks/dist/passport/jwt.guard";
import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {AirportDto} from "../../../dtos/airport.dto";
import {Response} from "express";
import {IRabbitmqPublisher} from "building-blocks/dist/rabbitmq/rabbitmq-publisher";
import {AirportCreated} from "building-blocks/dist/contracts/flight.contract";
import {Airport} from "../../../entities/airport.entity";

export class CreateAirport {
    code: string;
    name: string;
    address: string;

    constructor(request: Partial<CreateAirport> = {}) {
        Object.assign(this, request);
    }
}

export class CreateAirportRequestDto {
    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    address: string;

    constructor(request: Partial<CreateAirportRequestDto> = {}) {
        Object.assign(this, request);
    }
}

const createAirportValidations = Joi.object({
    code: Joi.string().required(),
    address: Joi.string().required(),
    name: Joi.string().required()
});

@ApiBearerAuth()
@ApiTags('Airports')
@Controller({
    path: `/airport`,
    version: '1',
})
export class CreateAirportController {

    constructor(private readonly commandBus: CommandBus) {
    }

    @Post('create')
    @UseGuards(JwtGuard)
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    @ApiResponse({status: 201, description: 'CREATED'})
    public async createAirport(@Body() request: CreateAirportRequestDto, @Res() res: Response): Promise<AirportDto> {
        const result = await this.commandBus.execute(
            new CreateAirport({
                code: request.code,
                name: request.name,
                address: request.address
            })
        );

        res.status(HttpStatus.CREATED).send(result);

        return result;
    }
}

@CommandHandler(CreateAirport)
export class CreateAirportHandler implements ICommandHandler<CreateAirport> {
    constructor(
        @Inject('IRabbitmqPublisher') private readonly rabbitmqPublisher: IRabbitmqPublisher,
        @Inject('IAirportRepository') private readonly airportRepository: IAirportRepository,
    ) {
    }

    async execute(command: CreateAirport): Promise<AirportDto> {
        await createAirportValidations.validateAsync(command);

        const existAirport = await this.airportRepository.findAirportByName(command.name);

        if (existAirport) {
            throw new ConflictException('Airport already taken');
        }

        const airportEntity = await this.airportRepository.createAirport(
            new Airport({
                name: command.name,
                code: command.code,
                address: command.address
            })
        );

        await this.rabbitmqPublisher.publishMessage(new AirportCreated(airportEntity));

        const result = mapper.map<Airport, AirportDto>(airportEntity, new AirportDto());

        return result;
    }
}
