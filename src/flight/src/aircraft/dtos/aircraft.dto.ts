export class AircraftDto {
  id: number;
  model: string;
  name: string;
  manufacturingYear: number;
  createdAt: Date;
  updatedAt?: Date;

  constructor(request: Partial<AircraftDto> = {}) {
    Object.assign(this, request);
  }
}
