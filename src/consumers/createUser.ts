import { UserCreated } from '../events/userCreated';
import { Logger } from '@nestjs/common';
import { serializeObject } from '../utils/serilization';

export const createUserConsumerHandler = async (
    queue: string,
    message: UserCreated,
) => {
    if (message == null || message == undefined) return;

    Logger.log(`message with data: ${serializeObject(message)} received.`);
};
