// import { IHandler, IRequest, mediatrJs } from 'building-blocks/mediatr-js/mediatr.js';
// import { User } from '../../../entities/user';
// import { UserDto } from '../../../dtos/user.dto';
// import { Controller, Get, Query, Route, Security, SuccessResponse } from 'tsoa';
// import Joi from 'joi';
// import mapper from '../../../mapping';
// import NotFoundException from 'building-blocks/types/exception/notFoundException';
// import { IUserRepository, UserRepository } from '../../../../data/repositories/userRepository';
// import { inject, injectable } from 'tsyringe';
//
// export class GetUserById implements IRequest<UserDto> {
//   id: number;
//
//   constructor(request: Partial<GetUserById> = {}) {
//     Object.assign(this, request);
//   }
// }
//
// const getUserByIdValidations = {
//   params: Joi.object().keys({
//     id: Joi.number().integer().required()
//   })
// };
//
// @Route('/user')
// export class GetUserByIdController extends Controller {
//   @Get('v1/get-by-id')
//   @Security('jwt')
//   @SuccessResponse('200', 'OK')
//   public async getUserById(@Query() id: number): Promise<UserDto> {
//     const result = await mediatrJs.send<UserDto>(
//       new GetUserById({
//         id: id
//       })
//     );
//
//     if (!result) {
//       throw new NotFoundException('User not found');
//     }
//     return result;
//   }
// }
//
// @injectable()
// export class GetUserByIdHandler implements IHandler<GetUserById, UserDto> {
//   constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}
//   async handle(request: GetUserById): Promise<UserDto> {
//     await getUserByIdValidations.params.validateAsync(request);
//
//     const usersEntity = await this.userRepository.findUserById(request.id);
//
//     const result = mapper.map<User, UserDto>(usersEntity, new UserDto());
//
//     return result;
//   }
// }
