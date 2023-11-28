// import { IHandler, IRequest, mediatrJs } from 'building-blocks/mediatr-js/mediatr.js';
// import { Role } from '../../../enums/role';
// import { User } from '../../../entities/user';
// import { UserDto } from '../../../dtos/user.dto';
// import mapper from '../../../mapping';
// import { Body, Controller, Put, Query, Route, Security, SuccessResponse } from 'tsoa';
// import { password } from 'building-blocks/utils/validation';
// import NotFoundException from 'building-blocks/types/exception/notFoundException';
// import { encryptPassword } from 'building-blocks/utils/encryption';
// import { IUserRepository, UserRepository } from '../../../../data/repositories/userRepository';
// import httpStatus from 'http-status';
// import Joi from 'joi';
// import { inject, injectable } from 'tsyringe';
// import { UserDeleted, UserUpdated } from 'building-blocks/contracts/identityContract';
// import { IPublisher } from 'building-blocks/rabbitmq/rabbitmq';
//
// export class UpdateUser implements IRequest<UserDto> {
//   id: number;
//   email: string;
//   password: string;
//   name: string;
//   role: Role;
//   passportNumber: string;
//   constructor(request: Partial<UpdateUser> = {}) {
//     Object.assign(this, request);
//   }
// }
//
// export class UpdateUserRequestDto {
//   email: string;
//   password: string;
//   name: string;
//   role: Role;
//   passportNumber: string;
//
//   constructor(request: Partial<UpdateUserRequestDto> = {}) {
//     Object.assign(this, request);
//   }
// }
//
// const updateUserValidations = Joi.object({
//   email: Joi.string().required().email(),
//   password: Joi.string().required().custom(password),
//   name: Joi.string().required(),
//   passportNumber: Joi.string().required(),
//   role: Joi.string().required().valid(Role.USER, Role.ADMIN)
// });
//
// @Route('/user')
// export class UpdateUserController extends Controller {
//   @Put('v1/update')
//   @Security('jwt')
//   @SuccessResponse('204', 'NO_CONTENT')
//   public async updateUser(
//     @Query() id: number,
//     @Body() request: UpdateUserRequestDto
//   ): Promise<UserDto> {
//     const result = await mediatrJs.send<UserDto>(
//       new UpdateUser({
//         id: id,
//         email: request.email,
//         password: request.password,
//         name: request.name,
//         role: request.role,
//         passportNumber: request.passportNumber
//       })
//     );
//
//     this.setStatus(httpStatus.NO_CONTENT);
//     return result;
//   }
// }
//
// @injectable()
// export class UpdateUserHandler implements IHandler<UpdateUser, UserDto> {
//   constructor(
//     @inject('IUserRepository') private userRepository: IUserRepository,
//     @inject('IPublisher') private publisher: IPublisher
//   ) {}
//
//   async handle(request: UpdateUser): Promise<UserDto> {
//     await updateUserValidations.validateAsync(request);
//
//     const existUser = await this.userRepository.findUserById(request.id);
//
//     if (!existUser) {
//       throw new NotFoundException('User not found');
//     }
//
//     const userEntity = await this.userRepository.updateUser(
//       new User({
//         email: request.email,
//         name: request.name,
//         password: await encryptPassword(request.password),
//         role: request.role,
//         passportNumber: request.passportNumber,
//         isEmailVerified: existUser.isEmailVerified,
//         tokens: existUser.tokens,
//         createdAt: existUser.createdAt,
//         updatedAt: new Date()
//       })
//     );
//
//     await this.publisher.publishMessage(new UserUpdated(userEntity));
//
//     const result = mapper.map<User, UserDto>(userEntity, new UserDto());
//
//     return result;
//   }
// }
//# sourceMappingURL=updateUser.js.map