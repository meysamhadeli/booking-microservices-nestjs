// import { IHandler, IRequest, mediatrJs } from 'building-blocks/mediatr-js/mediatr.js';
// import { User } from '../../../entities/user';
// import { UserDto } from '../../../dtos/user.dto';
// import { Controller, Delete, Query, Route, Security, SuccessResponse } from 'tsoa';
// import Joi from 'joi';
// import mapper from '../../../mapping';
// import httpStatus from 'http-status';
// import NotFoundException from 'building-blocks/types/exception/notFoundException';
// import { IUserRepository, UserRepository } from '../../../../data/repositories/userRepository';
// import { inject, injectable } from 'tsyringe';
// import { UserCreated, UserDeleted } from 'building-blocks/contracts/identityContract';
// import { IPublisher } from 'building-blocks/rabbitmq/rabbitmq';
//
// export class DeleteUserById implements IRequest<UserDto> {
//   id: number;
//
//   constructor(request: Partial<DeleteUserById> = {}) {
//     Object.assign(this, request);
//   }
// }
//
// const deleteUserValidations = {
//   params: Joi.object().keys({
//     userId: Joi.number().integer().required()
//   })
// };
//
// @Route('/user')
// export class DeleteUserByIdController extends Controller {
//   @Delete('v1/delete')
//   @Security('jwt')
//   @SuccessResponse('204', 'NO_CONTENT')
//   public async deleteUserById(@Query() id: number): Promise<UserDto> {
//     const user = await mediatrJs.send<UserDto>(
//       new DeleteUserById({
//         id: id
//       })
//     );
//
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }
//     this.setStatus(httpStatus.NO_CONTENT);
//     return user;
//   }
// }
//
// @injectable()
// export class DeleteUserByIdHandler implements IHandler<DeleteUserById, UserDto> {
//   constructor(
//     @inject('IUserRepository') private userRepository: IUserRepository,
//     @inject('IPublisher') private publisher: IPublisher
//   ) {}
//   async handle(request: DeleteUserById): Promise<UserDto> {
//     await deleteUserValidations.params.validateAsync(request);
//
//     const user = await this.userRepository.findUserById(request.id);
//
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }
//
//     const userEntity = await this.userRepository.removeUser(user);
//
//     await this.publisher.publishMessage(new UserDeleted(userEntity));
//
//     const result = mapper.map<User, UserDto>(userEntity, new UserDto());
//
//     return result;
//   }
// }
