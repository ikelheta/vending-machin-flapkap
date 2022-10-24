"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_test_1 = require("./user.test");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
it("should run", () => {
});
describe("/user/", () => (0, user_test_1.userTests)(supertest_1.default, app_1.default));
