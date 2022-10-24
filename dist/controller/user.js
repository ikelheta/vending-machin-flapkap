"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const authontication_1 = require("./../middleware/authontication");
const user_1 = require("./../model/user");
const rxjs_1 = require("rxjs");
const user_2 = __importDefault(require("../db/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    static createUser(body) {
        const { password, userName, role } = body;
        if (!userName || !password || !role) {
            return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => (0, rxjs_1.throwError)(() => 1)));
        }
        const user = new user_1.User(body);
        return (0, rxjs_1.of)(user).pipe((0, rxjs_1.mergeMap)((m) => (0, rxjs_1.from)(user_2.default.find({ userName }))), (0, rxjs_1.mergeMap)((m) => m.length === 0 ? (0, rxjs_1.of)(user) : (0, rxjs_1.throwError)(() => 2)), (0, rxjs_1.mergeMap)((m) => (0, rxjs_1.from)(bcrypt_1.default.hash(m.password, 10))), (0, rxjs_1.mergeMap)((m) => (0, rxjs_1.from)(user_2.default.create(Object.assign(Object.assign({}, user), { password: m })))), (0, rxjs_1.tap)((t) => console.log(t)), (0, rxjs_1.map)((m) => {
            return { token: (0, authontication_1.createToken)(Object.assign({}, m)) };
        }));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static findUser(id) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_2.default.findById(id).select(["-password", "-_id"])));
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------- 
    static findAllUserPagination(pn) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => {
            return (0, rxjs_1.forkJoin)([
                this.allUser(pn),
                this.userCount()
            ]);
        }), (0, rxjs_1.map)((m) => ({ data: m[0], colSize: m[1] })));
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------- 
    static allUser(pn) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_2.default.find({}).sort({ _id: -1 }).skip((pn - 1) * 10).limit(10).select(["userName", "role"])));
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------- 
    static userCount() {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_2.default.find({}).count()));
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------- 
    static deleteUser(id) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_2.default.findByIdAndDelete(id).select(["-password", "-_id"])));
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------- 
    static updateUser(id, data) {
        delete data.deposit;
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_2.default.findByIdAndUpdate(id, data).select(["-password", "-_id"])));
    }
}
exports.UserController = UserController;
