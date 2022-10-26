import { describe } from '@jest/globals';
import supertest from "supertest"
// import app from "../app"
import { productId, sellerUser, buyerUser, getToken, ibrahimProduct, sellerIbrahimToken, unvalidToken, missingFieldProduct, buyerToken, fairProduct, buyBody, deletedUserToken, successfullyBuyObj, userObj, resetUserToken, missingFieldUser, validUser } from "./testUtilities"
import createServer from "../utilis/server";

const app = createServer();

describe('user', () => {
  describe('create user with missing field', () => {
    it('return status 400 with message you must provide userName, password and role hint role must be ( seller or buyer ) ', async () => {
      const res = await supertest(app).post(`/api/user/signup`).send(missingFieldUser)

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('you must provide userName, password and role hint role must be ( seller or buyer )');

    })

  }),

    describe('create user that is already exist', () => {
      it('return status 400 with message "this user name is already exist"', async () => {
        const res = await supertest(app).post(`/api/user/signup`).send(sellerUser)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe("this user name is already exist");

      })

    }),

    describe('create user successfully', () => {
      it('return status 200 with user obj', async () => {
        const res = await supertest(app).post(`/api/user/signup`).send(validUser)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token')

      })

    }),

    describe('create user with any role exept (buyer seller)', () => {
      it('return status 400 with message you must provide userName, password and role hint role must be ( seller or buyer ) ', async () => {
        const res = await supertest(app).post(`/api/user/signup`).send({ ...validUser, userName: "ibrahim" })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe("this user name is already exist");

      })

    }),

    describe('sign in with wrong password', () => {
      it('return status 400 with message "wrong password"', async () => {
        const res = await supertest(app).post("/api/user/login").send({ ...buyerUser, password: "wrovdfng" })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe("wrong password");

      })

    }),

    describe('sign in with wrong userName', () => {
      it('return status 400 with message "wrongUserName"', async () => {
        const res = await supertest(app).post("/api/user/login").send({ sellerUser, userName: "wrong userName" })

        expect(res.status).toBe(400)
        expect(res.body.message).toBe('user is not exist');

      })

    }),

    describe('sign in successfully', () => {
      it('return status 200 with token', async () => {
        const res = await supertest(app).post("/api/user/login").send({ ...buyerUser })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token');

      })

    })
})