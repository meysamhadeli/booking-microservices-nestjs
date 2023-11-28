import { TypeMapper } from 'ts-mapper';
import { Token } from "./entities/token.entity";
import { TokenDto } from "./dtos/token.dto";


export class Mapper extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<Token, TokenDto>()
      .map(
        (src) => src.token,
        (dest) => dest.token
      )
      .map(
        (src) => src?.userId,
        (dest) => dest?.userId
      )
      .map(
        (src) => src.expires,
        (dest) => dest.expires
      );
  }
}

const mapper = new Mapper();

export default mapper;
