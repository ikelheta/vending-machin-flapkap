"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const authontication_1 = require("../middleware/authontication");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../db/user"));
class LoginController {
    static UserLogIn(body) {
        const { userName, password } = body;
        let user;
        return (0, rxjs_1.of)(true).pipe((0, operators_1.mergeMap)(() => (0, rxjs_1.from)(user_1.default.findOne({ userName }))), (0, rxjs_1.tap)((t) => user = t), (0, operators_1.mergeMap)((m) => m ? (0, rxjs_1.from)(bcrypt_1.default.compare(password, m.password)) : (0, rxjs_1.throwError)(() => 1)), (0, operators_1.mergeMap)((m) => m ? (0, rxjs_1.of)({ token: (0, authontication_1.createToken)(Object.assign({}, user)) }) : (0, rxjs_1.throwError)(() => 2)));
    }
}
exports.LoginController = LoginController;
