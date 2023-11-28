import { Logger } from '@nestjs/common';
import { CatalogCreated } from 'building-blocks/dist/contracts/catalog.contracts';

export const createCatalogConsumerHandler = async (
    queue: string,
    message: CatalogCreated,
) => {
    Logger.log(
        `Catalog with id: ${message?.id}, name: ${message?.name} and price: ${message?.price} created.`,
    );
};
