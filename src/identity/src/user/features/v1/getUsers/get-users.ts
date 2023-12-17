import {UserDto} from '../../../dtos/user.dto';
import Joi from 'joi';
import mapper from '../../../mapping';
import {ApiBearerAuth, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Inject, ParseBoolPipe, Query, UseGuards} from "@nestjs/common";
import {IQueryHandler, QueryBus, QueryHandler} from "@nestjs/cqrs";
import {IUserRepository} from "../../../../data/repositories/user.repository";
import {User} from "../../../entities/user.entity";
import {JwtGuard} from "../../../../../../building-blocks/passport/jwt.guard";
import {PagedResult} from "building-blocks/types/pagination/paged-result";

export class GetUsers {
  page = 1;
  pageSize = 10;
  orderBy = 'id';
  order: 'ASC' | 'DESC' = 'ASC';
  searchTerm?: string = null;

  constructor(request: Partial<GetUsers> = {}) {
    Object.assign(this, request);
  }
}

const getUsersValidations = Joi.object<GetUsers>({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
  orderBy: Joi.string().valid('id', 'name', 'email').default('id'),
  order: Joi.string().valid('ASC', 'DESC').default('ASC'),
  searchTerm: Joi.string().allow(null).optional()
});

@ApiBearerAuth()
@ApiTags('Users')
@Controller({
  path: `/user`,
  version: '1',
})
export class GetUsersController {

  constructor(private readonly queryBus: QueryBus) {
  }

  @Get('get')
  @UseGuards(JwtGuard)
  @ApiResponse({status: 200, description: 'OK'})
  @ApiResponse({status: 401, description: 'UNAUTHORIZED'})
  @ApiResponse({status: 400, description: 'BAD_REQUEST'})
  @ApiResponse({status: 403, description: 'FORBIDDEN'})
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'order', required: false, type: 'ASC' , example: 'ASC' })
  @ApiQuery({ name: 'orderBy', required: false, type: '', example: 'id' })
  @ApiQuery({ name: 'searchTerm', required: false, type: '' })
  public async getUsers(
      @Query('pageSize') pageSize: number = 10,
      @Query('page') page: number = 1,
      @Query('order') order: 'ASC' | 'DESC' = 'ASC',
      @Query('orderBy') orderBy: string = 'id',
      @Query('searchTerm') searchTerm?: string
  ): Promise<PagedResult<UserDto[]>> {

    const result = await this.queryBus.execute(new GetUsers({
      page: page,
      pageSize: pageSize,
      searchTerm: searchTerm,
      order: order,
      orderBy: orderBy
    }));

    return result;
  }
}


@QueryHandler(GetUsers)
export class GetUsersHandler implements IQueryHandler<GetUsers> {
  constructor(
      @Inject('IUserRepository') private readonly userRepository: IUserRepository) {
  }

  async execute(command: GetUsers): Promise<PagedResult<UserDto[]>> {
    await getUsersValidations.validateAsync(command);

    const [usersEntity, total] = await this.userRepository.findUsers(
        command.page,
        command.pageSize,
        command.orderBy,
        command.order,
        command.searchTerm
    );

    if (usersEntity?.length == 0) return new PagedResult<UserDto[]>(null, total);

    const result = usersEntity.map((user) => mapper.map<User, UserDto>(user, new UserDto()));

    return new PagedResult<UserDto[]>(result, total);
  }
}
