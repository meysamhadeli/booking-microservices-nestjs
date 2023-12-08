import {UserDto} from '../../../dtos/user.dto';
import Joi from 'joi';
import mapper from '../../../mapping';
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Inject, NotFoundException, Query, UseGuards} from "@nestjs/common";
import {IQueryHandler, QueryBus, QueryHandler} from "@nestjs/cqrs";
import {IUserRepository} from "../../../../data/repositories/user.repository";
import {User} from "../../../entities/user.entity";
import {JwtGuard} from "../../../../../../building-blocks/passport/jwt.guard";

export class GetUserById {
    id: number;

    constructor(request: Partial<GetUserById> = {}) {
        Object.assign(this, request);
    }
}

const getUserByIdValidations = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    })
};

@ApiBearerAuth()
@ApiTags('Users')
@Controller({
    path: `/user`,
    version: '1',
})
export class GetUserByIdController {
    constructor(private readonly queryBus: QueryBus) {
    }

    @Get('get-by-id')
    @UseGuards(JwtGuard)
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
    @ApiResponse({status: 400, description: 'BAD_REQUEST'})
    @ApiResponse({status: 403, description: 'FORBIDDEN'})
    public async getUserById(@Query() id: number): Promise<UserDto> {

        const result = await this.queryBus.execute(new GetUserById({
            id: id
        }));

        if (!result) {
            throw new NotFoundException('User not found');
        }
        return result;
    }
}

@QueryHandler(GetUserById)
export class GetUserByIdHandler implements IQueryHandler<GetUserById> {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository) {
    }

    async execute(query: GetUserById): Promise<UserDto> {
        await getUserByIdValidations.params.validateAsync(query);

        const usersEntity = await this.userRepository.findUserById(query.id);

        const result = mapper.map<User, UserDto>(usersEntity, new UserDto());

        return result;
    }
}
