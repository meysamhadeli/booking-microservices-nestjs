import {Inject, Logger} from '@nestjs/common';
import {Passenger} from "../../passenger/entities/passenger.entity";
import {IPassengerRepository} from "../../data/repositories/passenger.repository";
import {PassengerType} from "../../passenger/enums/passenger-type.enum";

export class CreateUserHandler {

    constructor(@Inject('IPassengerRepository') private readonly passengerRepository: IPassengerRepository) {}

    async createUserConsumerHandler(queue: string, message: any): Promise<void> {
        if (message == null || message == undefined) return;

        const passenger = await this.passengerRepository.createPassenger(
            new Passenger({
                name: message.name,
                passportNumber: message.passportNumber,
                age: 20,
                passengerType: PassengerType.MALE
            })
        );

        Logger.log(`Passenger with name: ${passenger?.name} created.`);
    }

}
