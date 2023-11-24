"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const rabbitmqPublisher_1 = require("../modules/rabbitmq/rabbitmqPublisher");
const userCreated_1 = require("../events/userCreated");
let AppController = class AppController {
    constructor(rabbitMQPublisher) {
        this.rabbitMQPublisher = rabbitMQPublisher;
    }
    async publishSampleMessage() {
        await this.rabbitMQPublisher.publishMessage(new userCreated_1.UserCreated({ id: 1, name: 'meysam' }));
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "publishSampleMessage", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [rabbitmqPublisher_1.RabbitmqPublisher])
], AppController);
//# sourceMappingURL=app.controller.js.map