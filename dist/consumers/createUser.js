"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserConsumerHandler = void 0;
const common_1 = require("@nestjs/common");
const serilization_1 = require("../utils/serilization");
const createUserConsumerHandler = async (queue, message) => {
    if (message == null || message == undefined)
        return;
    common_1.Logger.log(`message with data: ${(0, serilization_1.serializeObject)(message)} received.`);
};
exports.createUserConsumerHandler = createUserConsumerHandler;
//# sourceMappingURL=createUser.js.map