import {Inject, Logger} from '@nestjs/common';
import {Passenger} from "../../passenger/entities/passenger.entity";
import {IPassengerRepository} from "../../data/repositories/passenger.repository";
import {PassengerType} from "../../passenger/enums/passenger-type.enum";
import {UserCreated} from "building-blocks/contracts/identity.contract";

let _passengerRepository: IPassengerRepository;
export class CreateUserHandler {

    constructor(@Inject('IPassengerRepository') private readonly passengerRepository: IPassengerRepository) {
        _passengerRepository = passengerRepository;
    }

    async createUserConsumerHandler(queue: string, message: UserCreated): Promise<void> {
        if (message == null || message == undefined) return;

        const passenger = await _passengerRepository.createPassenger(
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
