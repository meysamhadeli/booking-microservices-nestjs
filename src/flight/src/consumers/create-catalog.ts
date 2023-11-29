import { Logger } from '@nestjs/common';

export const createCatalogConsumerHandler = async (
    queue: string,
    message: any,
) => {
    Logger.log(
        `Catalog with id: ${message?.id}, name: ${message?.name} and price: ${message?.price} created.`,
    );
};
