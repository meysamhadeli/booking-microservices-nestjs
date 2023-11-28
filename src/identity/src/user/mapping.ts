import { UserDto } from './dtos/user.dto';
import { TypeMapper } from 'ts-mapper';
import { User } from "./entities/user.entity";

export class Mapper extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<User, UserDto>()
      .map(
        (src) => src.name,
        (dest) => dest.name
      )
      .map(
        (src) => src.role,
        (dest) => dest.role
      )
      .map(
        (src) => src.id,
        (dest) => dest.id
      )
      .map(
        (src) => src.email,
        (dest) => dest.email
      )
      .map(
        (src) => src?.updatedAt,
        (dest) => dest?.updatedAt
      )
      .map(
        (src) => src.createdAt,
        (dest) => dest.createdAt
      )
      .map(
        (src) => src.passportNumber,
        (dest) => dest.passportNumber
      )
      .map(
        (src) => src.passportNumber,
        (dest) => dest.passportNumber
      )
      .map(
        (src) => src.isEmailVerified,
        (dest) => dest.isEmailVerified
      );
  }
}

const mapper = new Mapper();

export default mapper;
