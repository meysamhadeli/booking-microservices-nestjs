// import { Injectable } from '@nestjs/common';
// import { ApiProperty } from '@nestjs/swagger';
//
// export class User {
//     id: number;
//     username: string;
//     password: string;
// }
//
// export class UserDto {
//     @ApiProperty()
//     username: string;
//     @ApiProperty()
//     password: string;
// }
//
// @Injectable()
// export class UserService {
//     private readonly users: User[] = [
//         {
//             id: 1,
//             username: 'meysam',
//             password: '000000',
//         },
//         {
//             id: 2,
//             username: 'maria',
//             password: 'guess',
//         },
//     ];
//
//     async findByUsername(username: string): Promise<User | undefined> {
//         return this.users.find((user) => user.username === username);
//     }
//
//     async findById(id: number): Promise<User | undefined> {
//         return this.users.find((user) => user.id === id);
//     }
// }
//# sourceMappingURL=user.service.js.map