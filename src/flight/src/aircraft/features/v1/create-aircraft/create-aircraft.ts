import Joi from 'joi';
import {inject, injectable} from 'tsyringe';
import {IAircraftRepository} from '../../../../data/repositories/aircraftRepository';
import mapper from '../../../mappings';
import {ApiBearerAuth, ApiProperty, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, ConflictException, Controller, HttpStatus, Inject, Post, Res, UseGuards} from "@nestjs/common";
import {JwtGuard} from "building-blocks/dist/passport/jwt.guard";
import {AircraftDto} from "../../../dtos/aircraft.dto";
import {CommandBus, CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Response} from "express";
import {IRabbitmqPublisher} from "building-blocks/dist/rabbitmq/rabbitmq-publisher";
import {Aircraft} from "../../../entities/aircraft.entity";
import {AircraftCreated} from "building-blocks/dist/contracts/flight.contract";

export class CreateAircraft {
    model: string;
    name: string;
    manufacturingYear: number;

    constructor(request: Partial<CreateAircraft> = {}) {
        Object.assign(this, request);
    }
}

export class CreateAircraftRequestDto {
    @ApiProperty()
    model: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    manufacturingYear: number;

    constructor(request: Partial<CreateAircraftRequestDto> = {}) {
        Object.assign(this, request);
    }
}

const createAircraftValidations = Joi.object({
    model: Joi.string().required(),
    manufacturingYear: Joi.number().required(),
    name: Joi.string().required()
});

@ApiBearerAuth()
@ApiTags('Aircrafts')
@Controller({
    path: `/aircraft`,
    version: '1',
})
export class CreateAircraftController {

    constructor(private readonly commandBus: CommandBus) {
    }

    @Post('create')
    @UseGuards(JwtGuard)
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    @ApiResponse({status: 201, description: 'CREATED'})
    public async createAircraft(@Body() request: CreateAircraftRequestDto, @Res() res: Response): Promise<AircraftDto> {
        const result = await this.commandBus.execute(
            new CreateAircraft({
                model: request.model,
                name: request.name,
                manufacturingYear: request.manufacturingYear
            })
        );

        res.status(HttpStatus.CREATED).send(result);

        return result;
    }
}

@CommandHandler(CreateAircraft)
export class CreateAircraftHandler implements ICommandHandler<CreateAircraft> {
    constructor(
        @Inject('IRabbitmqPublisher') private readonly rabbitmqPublisher: IRabbitmqPublisher,
        @Inject('IAircraftRepository') private readonly aircraftRepository: IAircraftRepository,
    ) {
    }

    async execute(command: CreateAircraft): Promise<AircraftDto> {
        await createAircraftValidations.validateAsync(command);

        const existAircraft = await this.aircraftRepository.findAircraftByName(command.name);

        if (existAircraft) {
            throw new ConflictException('Aircraft already taken');
        }

        const aircraftEntity = await this.aircraftRepository.createAircraft(
            new Aircraft({
                name: command.name,
                manufacturingYear: command.manufacturingYear,
                model: command.model
            })
        );

        await this.rabbitmqPublisher.publishMessage(new AircraftCreated(aircraftEntity));

        const result = mapper.map<Aircraft, AircraftDto>(aircraftEntity, new AircraftDto());

        return result;
    }
}
