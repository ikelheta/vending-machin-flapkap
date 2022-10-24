"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(o) {
        o = o ? o : {};
        this.userName = o.userName;
        this.password = o.password;
        this.deposit = 0;
        this.role = o.role;
    }
}
exports.User = User;
