"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerType = exports.PassengerDto = void 0;
class PassengerDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.PassengerDto = PassengerDto;
var PassengerType;
(function (PassengerType) {
    PassengerType[PassengerType["UNKNOWN"] = 0] = "UNKNOWN";
    PassengerType[PassengerType["MALE"] = 1] = "MALE";
    PassengerType[PassengerType["FEMALE"] = 2] = "FEMALE";
    PassengerType[PassengerType["BABY"] = 3] = "BABY";
})(PassengerType || (exports.PassengerType = PassengerType = {}));
//# sourceMappingURL=passenger.contract.js.map