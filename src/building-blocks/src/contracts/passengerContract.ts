export class PassengerDto {
  id: number;
  name: string;
  age: number;
  passportNumber: string;
  passportType: PassengerType;
  createdAt: Date;
  updatedAt?: Date;

  constructor(partial?: Partial<PassengerDto>) {
    Object.assign(this, partial);
  }
}

export enum PassengerType {
  UNKNOWN = 0,
  MALE,
  FEMALE,
  BABY
}
