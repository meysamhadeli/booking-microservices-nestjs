"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.UserUpdated = exports.UserDeleted = exports.UserCreated = void 0;
class UserCreated {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.UserCreated = UserCreated;
class UserDeleted {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.UserDeleted = UserDeleted;
class UserUpdated {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.UserUpdated = UserUpdated;
var Role;
(function (Role) {
    Role[Role["USER"] = 0] = "USER";
    Role[Role["ADMIN"] = 1] = "ADMIN";
})(Role || (exports.Role = Role = {}));
//# sourceMappingURL=identity.contract.js.map