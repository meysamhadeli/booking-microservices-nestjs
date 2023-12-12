import {Injectable} from '@nestjs/common';
import {EntityManager} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Role} from "../../user/enums/role.enum";
import {encryptPassword} from "building-blocks/utils/encryption";

@Injectable()
export class DataSeeder {
    constructor(private readonly entityManager: EntityManager
    ) {
    }

    async seedAsync(): Promise<void> {
        await this.seedUser();
    }

    private async seedUser(): Promise<void> {

        const userRepository = this.entityManager.getRepository(User);
        if ((await userRepository.find())?.length == 0) {
            await userRepository.save(
                new User({
                    id: 1,
                    name: 'developer',
                    email: 'dev@dev.com',
                    password: await encryptPassword('Admin@12345'),
                    role: Role.ADMIN,
                    passportNumber: '12345678',
                    isEmailVerified: true,
                })
            );
        }
    }
}
