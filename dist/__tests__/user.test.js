"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTests = void 0;
const userTests = (request, app) => {
    describe("createUser", () => {
        it("should create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                userName: "omar2",
                password: "123456789",
                role: "seller",
            };
            const res = yield request(app).post("/signup").send(payload);
            const data = res.body;
            expect(res.statusCode).toBe(200);
            const { password } = payload, rest = __rest(payload, ["password"]);
            expect(data).toMatchObject(Object.assign(Object.assign({}, rest), { token: expect.any(String) }));
        }));
    });
};
exports.userTests = userTests;
