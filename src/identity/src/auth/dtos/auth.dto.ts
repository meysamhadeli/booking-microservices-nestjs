import { TokenDto } from "./token.dto";

export class AuthDto {
  access: TokenDto;
  refresh?: TokenDto;

  constructor(request: Partial<AuthDto> = {}) {
    Object.assign(this, request);
  }
}
