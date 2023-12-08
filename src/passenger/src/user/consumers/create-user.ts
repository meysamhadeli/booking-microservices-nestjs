import { Logger } from '@nestjs/common';
import {UserCreated} from "building-blocks/contracts/identity.contract";

export const createUserConsumerHandler = async (
    queue: string,
    message: any,
) => {
    Logger.log(
        `User with id: ${message?.id}, name: ${message?.name} and email: ${message?.email} created.`,
    );
};
