import { userTests } from './user.test';
import request from "supertest";
import req from "express/lib/request";
import app from "../app"
it("should run", () => {

})
describe("/user/", () => userTests(request, app));