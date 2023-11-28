import { TypeMapper } from 'ts-mapper';
import {
    CreateCatalog,
    CreateCatalogDto,
} from './features/v1/create-catalog/create-catalog';
import { Catalog } from './entities/catalog.entity';
import { CatalogDto } from './dtos/catalog.dto';

export class Mapper extends TypeMapper {
    constructor() {
        super();
        this.config();
    }

    private config(): void {
        this.createMap<CreateCatalogDto, CreateCatalog>()
            .map(
                (src) => src.price,
                (dest) => dest.price,
            )
            .map(
                (src) => src.name,
                (dest) => dest.name,
            );

        this.createMap<Catalog, CatalogDto>()
            .map(
                (src) => src.price,
                (dest) => dest.price,
            )
            .map(
                (src) => src.name,
                (dest) => dest.name,
            )
            .map(
                (src) => src.id,
                (dest) => dest.id,
            );

        this.createMap<CreateCatalog, Catalog>()
            .map(
                (src) => src.price,
                (dest) => dest.price,
            )
            .map(
                (src) => src.name,
                (dest) => dest.name,
            );
    }
}

const mapper = new Mapper();

export default mapper;
