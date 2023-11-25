import { CatalogCreated } from '../contracts/catalog.contracts';
import { Logger } from '@nestjs/common';

export const createCatalogConsumerHandler = async (
    queue: string,
    message: CatalogCreated,
) => {
    Logger.log(
        `Catalog with id: ${message?.id}, name: ${message?.name} and price: ${message?.price} created.`,
    );
};
