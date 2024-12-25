"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const identity_contract_1 = require("building-blocks/contracts/identity.contract");
const faker_1 = require("@faker-js/faker");
const TypeMoq = __importStar(require("typemoq"));
const fake_user_entity_1 = require("../../../shared/fakes/user/fake-user.entity");
const user_entity_1 = require("../../../../src/user/entities/user.entity");
const fake_create_user_1 = require("../../../shared/fakes/user/fake-create-user");
const create_user_1 = require("../../../../src/user/features/v1/create-user/create-user");
describe('unit test for create user', () => {
    let createUserHandler;
    const fakeUser = fake_user_entity_1.FakeUser.generate();
    const mockUserRepository = TypeMoq.Mock.ofType();
    const mockPublisher = TypeMoq.Mock.ofType();
    beforeEach(() => {
        createUserHandler = new create_user_1.CreateUserHandler(mockPublisher.object, mockUserRepository.object);
    });
    it('should create a user and retrieve a valid data', async () => {
        const email = faker_1.faker.internet.email();
        mockUserRepository
            .setup((x) => x.findUserByEmail(TypeMoq.It.isAnyString()))
            .returns(() => null);
        mockUserRepository
            .setup((x) => x.createUser(TypeMoq.It.isAnyObject(user_entity_1.User)))
            .returns(() => Promise.resolve(fakeUser));
        mockPublisher
            .setup((x) => x.publishMessage(TypeMoq.It.isAnyObject(identity_contract_1.UserCreated)))
            .returns(() => Promise.resolve());
        const result = await createUserHandler.execute(fake_create_user_1.FakeCreateUser.generate(fakeUser));
        mockUserRepository.verify((x) => x.findUserByEmail(TypeMoq.It.isAnyString()), TypeMoq.Times.once());
        mockPublisher.verify((x) => x.publishMessage(TypeMoq.It.isAnyObject(identity_contract_1.UserCreated)), TypeMoq.Times.once());
        mockUserRepository.verify((x) => x.createUser(TypeMoq.It.isAnyObject(user_entity_1.User)), TypeMoq.Times.once());
        expect(result).not.toBeNull();
    });
});
