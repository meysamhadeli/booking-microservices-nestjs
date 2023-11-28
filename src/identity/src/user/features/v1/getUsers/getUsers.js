// import { IHandler, IRequest, mediatrJs } from 'building-blocks/mediatr-js/mediatr.js';
// import { User } from '../../../entities/user';
// import { UserDto } from '../../../dtos/user.dto';
// import { Controller, Get, Query, Route, Security, SuccessResponse } from 'tsoa';
// import Joi from 'joi';
// import mapper from '../../../mapping';
// import { PagedResult } from 'building-blocks/types/pagination/pagedResult';
// import { IUserRepository, UserRepository } from '../../../../data/repositories/userRepository';
// import { inject, injectable } from 'tsyringe';
//
// export class GetUsers implements IRequest<PagedResult<UserDto[]>> {
//   page = 1;
//   pageSize = 10;
//   orderBy = 'id';
//   order: 'ASC' | 'DESC' = 'ASC';
//   searchTerm?: string = null;
//
//   constructor(request: Partial<GetUsers> = {}) {
//     Object.assign(this, request);
//   }
// }
//
// const getUsersValidations = Joi.object<GetUsers>({
//   page: Joi.number().integer().min(1).default(1),
//   pageSize: Joi.number().integer().min(1).default(10),
//   orderBy: Joi.string().valid('id', 'name', 'email').default('id'),
//   order: Joi.string().valid('ASC', 'DESC').default('ASC'),
//   searchTerm: Joi.string().allow(null).optional()
// });
//
// @Route('/user')
// export class GetUsersController extends Controller {
//   @Get('v1/get')
//   @Security('jwt')
//   @SuccessResponse('200', 'OK')
//   public async getUsers(
//     @Query() pageSize = 10,
//     @Query() page = 1,
//     @Query() order: 'ASC' | 'DESC' = 'ASC',
//     @Query() orderBy = 'id',
//     @Query() searchTerm?: string
//   ): Promise<PagedResult<UserDto[]>> {
//     const result = await mediatrJs.send<PagedResult<UserDto[]>>(
//       new GetUsers({
//         page: page,
//         pageSize: pageSize,
//         searchTerm: searchTerm,
//         order: order,
//         orderBy: orderBy
//       })
//     );
//
//     return result;
//   }
// }
//
// @injectable()
// export class GetUsersHandler implements IHandler<GetUsers, PagedResult<UserDto[]>> {
//   constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}
//
//   async handle(request: GetUsers): Promise<PagedResult<UserDto[]>> {
//     await getUsersValidations.validateAsync(request);
//
//     const [usersEntity, total] = await this.userRepository.findUsers(
//       request.page,
//       request.pageSize,
//       request.orderBy,
//       request.order,
//       request.searchTerm
//     );
//
//     if (usersEntity?.length == 0) return new PagedResult<UserDto[]>(null, total);
//
//     const result = usersEntity.map((user) => mapper.map<User, UserDto>(user, new UserDto()));
//
//     return new PagedResult<UserDto[]>(result, total);
//   }
// }
//# sourceMappingURL=getUsers.js.map