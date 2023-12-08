export declare class PassengerDto {
    id: number;
    name: string;
    age: number;
    passportNumber: string;
    passportType: PassengerType;
    createdAt: Date;
    updatedAt?: Date;
    constructor(partial?: Partial<PassengerDto>);
}
export declare enum PassengerType {
    UNKNOWN = 0,
    MALE = 1,
    FEMALE = 2,
    BABY = 3
}
