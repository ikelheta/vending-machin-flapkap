import { describe } from '@jest/globals';
import supertest from "supertest"
// import app from "../app"
import { productId, sellerUser, buyerUser, getToken, ibrahimProduct, sellerIbrahimToken, unvalidToken, missingFieldProduct, buyerToken, fairProduct, buyBody, deletedUserToken, successfullyBuyObj, userObj, resetUserToken } from "./testUtilities"
import createServer from "../utilis/server";



const app = createServer();

describe('product', () => {

  describe('get product', () => {


    describe('with out token', () => {
      it('should give status (401)', async () => {
        await supertest(app).get(`/api/product/${productId}`).expect(401)
      })
    }),


      describe('with unvalid token', () => {
        it('should give status (403)', async () => {
          const res = await supertest(app).get(`/api/product/${productId}`).set("Authorization", `Bearer ${unvalidToken}`)
          expect(res.status).toBe(403)
        }, 30000)
      }),


      describe('with wrong product id', () => {
        it('should give status (404', async () => {
          const res = await supertest(app).get(`/api/product/63555f5e94cd990010eea8f6`).set("Authorization", `Bearer ${sellerIbrahimToken}`)
          expect(res.status).toBe(404)
        }, 30000)
      }),


      describe('succesful ', () => {
        it('should give status (200)', async () => {
          const res = await supertest(app).get(`/api/product/${productId}`).set("Authorization", `Bearer ${sellerIbrahimToken}`)
          const body = res.body
          expect(res.status).toBe(200)
        })
      })

  }),
    //-----------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------
    describe('create product', () => {

      describe('with missing field', () => {
        it('should give status 400 and message "please provide amountAvailable ,cost and productName "', async () => {
          const res = await (await supertest(app).post(`/api/product`).set("Authorization", `Bearer ${sellerIbrahimToken}`).send(missingFieldProduct))
          const body = res.body
          expect(res.status).toBe(400)
          expect(res.body.message).toBe("please provide amountAvailable ,cost and productName ");


        })
      }),


        describe('buyer try to sell product ', () => {
          it('should give status 401 and error "you must be a Sseller" ', async () => {
            const res = await (await supertest(app).post(`/api/product`).set("Authorization", `Bearer ${buyerToken}`).send(missingFieldProduct))
            const body = res.body
            expect(res.status).toBe(401)
            expect(res.body.error).toBe("you must be a Sseller");
          })
        }),


        describe('successfull', () => {
          it('should give status 200 and response with same properties ', async () => {
            const res = await (await supertest(app).post(`/api/product`).set("Authorization", `Bearer ${sellerIbrahimToken}`).send(fairProduct))
            const body = res.body
            expect(res.status).toBe(200)
            expect(res.body).toMatchObject(fairProduct)
          })
        }),


        describe('with negative cost  ', () => {
          it('should give status 400 and response with "cost must be a  positive number " ', async () => {
            const res = await (await supertest(app).post(`/api/product`).set("Authorization", `Bearer ${sellerIbrahimToken}`).send({ ...fairProduct, cost: -100 }))
            const body = res.body
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("cost must be a  positive number ")
          })
        }),


        describe('with negative amountAvailable  ', () => {
          it('should give status 400 and response with "cost must be a  positive number  ', async () => {
            const res = await (await supertest(app).post(`/api/product`).set("Authorization", `Bearer ${sellerIbrahimToken}`).send({ ...fairProduct, amountAvailable: -100 }))
            const body = res.body
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("amount available must be a whole positive number ")
          })
        }),


        describe('with 0 cost  ', () => {
          it('should give status 400 and response with "cost must be a  positive number " ', async () => {
            const res = await (await supertest(app).post(`/api/product`).set("Authorization", `Bearer ${sellerIbrahimToken}`).send({ ...fairProduct, cost: 0 }))
            const body = res.body
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("cost must be a  positive number ")
          })
        }),


        describe('with 0 amountAvailable  ', () => {
          it('should give status 400 and response with "cost must be a  positive number " ', async () => {
            const res = await (await supertest(app).post(`/api/product`).set("Authorization", `Bearer ${sellerIbrahimToken}`).send({ ...fairProduct, amountAvailable: 0 }))
            const body = res.body
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("amount available must be a whole positive number ")
          })
        }),


        describe('with amountAvailable as a decimal number ', () => {
          it('should give status 400 and response with "cost must be a  positive number " ', async () => {
            const res = await (await supertest(app).post(`/api/product`).set("Authorization", `Bearer ${sellerIbrahimToken}`).send({ ...fairProduct, amountAvailable: 3.7 }))
            const body = res.body
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("amount available must be a whole positive number ")
          })
        })
    })
  //-----------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------
  describe('update product', () => {


    describe('try to update product that i didnt post', () => {
      it('should give status 400 and response with "you can only update your own products"', async () => {
        const res = await (await supertest(app).put(`/api/product/${productId}`).set("Authorization", `Bearer ${sellerIbrahimToken}`).send(fairProduct))
        expect(res.status).toBe(403)
        expect(res.body.message).toBe("you can only update your own products")
      })
    }),

      describe('try to update product with unvalid properities', () => {
        it('should give status 400 and response with "you can only update your own products"', async () => {
          const res = await (await supertest(app).put(`/api/product/${ibrahimProduct}`).set("Authorization", `Bearer ${sellerIbrahimToken}`).send({ fairProduct, cost: -100 }))
          expect(res.status).toBe(400)
          expect(res.body.message).toBe("unvalid values")
        })
      }),

      describe('successfully updated', () => {
        it('should give status 200 and response with new product', async () => {
          const res = await (await supertest(app).put(`/api/product/${ibrahimProduct}`).set("Authorization", `Bearer ${sellerIbrahimToken}`).send(fairProduct))
          expect(res.status).toBe(200)
          expect(res.body).toMatchObject({ _id: ibrahimProduct, ...fairProduct })
        })
      })

  }),
    //-----------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------
    describe('delete product', () => {

      describe('try to delete product that i didnt post', () => {
        it('should give status 400 and response with "you can only delete your own products"', async () => {
          const res = await (await supertest(app).delete(`/api/product/${productId}`).set("Authorization", `Bearer ${sellerIbrahimToken}`))
          expect(res.status).toBe(403)
          expect(res.body.message).toBe("you can only delete your own products")
        })
      })
      // ,

      // describe('try to delete your own product', () => {
      //   it('should give status 200 with deleted product', async () => {
      //     const res = await (await supertest(app).delete(`/api/product/${productId}`).set("Authorization", `Bearer ${sellerIbrahimToken}`))
      //     expect(res.status).toBe(200)
      //   })
      // })

    }),
    //-----------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------
    describe('buy product', () => {
      describe('try to buy product and you are a seller ', () => {
        it('should give status 401 and error "you must be a Sseller" ', async () => {
          const res = await (await supertest(app).post(`/api/product/buy`).set("Authorization", `Bearer ${sellerIbrahimToken}`).send(buyBody))

          expect(res.status).toBe(401)
          expect(res.body.error).toBe("you must be a buyer");
        })
      }),

        describe('try to buy product and dont have enough deposit', () => {
          it('should give status 401 and error "you must be a Sseller" ', async () => {
            const res = await (await supertest(app).post(`/api/product/buy`).set("Authorization", `Bearer ${buyerToken}`).send({ ...buyBody, amount: 10000 }))

            expect(res.status).toBe(400)
            expect(res.body.message).toBe("please add coins to your deposit");
          })
        }),

        describe('try to buy amount of product that is not exist ', () => {
          it('should give status 401 and error "you must be a Sseller" ', async () => {
            const res = await (await supertest(app).post(`/api/product/buy`).set("Authorization", `Bearer ${buyerToken}`).send({
              ...buyBody, amount: 1,
              productId: '63555f5e94cd990010eea8f8'
            }))

            expect(res.status).toBe(400)
            expect(res.body.message).toBe("amount available of this product is not enough");
          })
        }),

        describe('try to buy decimal amount of product', () => {
          it('should give status 400 and message amount should be a whole number ', async () => {
            const res = await (await supertest(app).post(`/api/product/buy`).set("Authorization", `Bearer ${buyerToken}`).send({
              ...buyBody, amount: 1.5,
            }))

            expect(res.status).toBe(400)
            expect(res.body.message).toBe("amount should be a whole number");
          })
        })

        , describe('try to buy not existing product', () => {
          it('should give status 400 and message this product not exist ', async () => {
            const res = await (await supertest(app).post(`/api/product/buy`).set("Authorization", `Bearer ${buyerToken}`).send({
              ...buyBody, amount: 1,
              productId: '63554b36e4c5fca0446561ea'
            }))

            expect(res.status).toBe(400)
            expect(res.body.message).toBe("this product is not exist");
          })
        }),

        describe('try to buy with deleted user token', () => {
          it('should give status 400 and message your account is not exist ', async () => {
            const res = await (await supertest(app).post(`/api/product/buy`).set("Authorization", `Bearer ${deletedUserToken}`).send(buyBody))

            expect(res.status).toBe(400)
            expect(res.body.message).toBe("your account is not exist");
          })
        }),

        describe('try to buy successfully', () => {
          it('should give status 400 and message your account is not exist ', async () => {
            const res = await (await supertest(app).post(`/api/product/buy`).set("Authorization", `Bearer ${buyerToken}`).send(buyBody))

            expect(res.status).toBe(200)
            expect(res.body).toMatchObject(successfullyBuyObj);
          })
        })



    }),
    //-----------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------
    describe('add coins', () => {
      describe('try to add coins not in [5, 10, 20, 50, 100]', () => {
        it('should give status 400 and message "only buyers can add coins and coins must be in 100,50,20,10,5"', async () => {
          const res = await (await supertest(app).post(`/api/deposite/add/300`).set("Authorization", `Bearer ${buyerToken}`))

          expect(res.status).toBe(400)
          expect(res.body.message).toBe("only buyers can add coins and coins must be in 100,50,20,10,5");
        })
      }),

        describe('try to add coins in [5, 10, 20, 50, 100]', () => {
          it('should give status 200', async () => {
            const res = await (await supertest(app).post(`/api/deposite/add/100`).set("Authorization", `Bearer ${buyerToken}`))

            expect(res.status).toBe(200)
            expect(res.body).toMatchObject(userObj)
          })
        }),

        describe('reset deposit', () => {
          it('should give status 200', async () => {
            const res = await (await supertest(app).post(`/api/deposit/reset`).set("Authorization", `Bearer ${resetUserToken}`))

            expect(res.status).toBe(200)
            expect(res.body).toMatchObject(userObj)
          })
        })
    })


})