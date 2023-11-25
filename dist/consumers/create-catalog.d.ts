import { CatalogCreated } from '../contracts/catalog.contracts';
export declare const createCatalogConsumerHandler: (queue: string, message: CatalogCreated) => Promise<void>;
