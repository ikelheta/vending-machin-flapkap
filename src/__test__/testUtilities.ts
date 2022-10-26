import supertest from "supertest"
import createServer from "../utilis/server";



const app = createServer();
export const productId = '63555f5e94cd990010eea8f8'
export const ibrahimProduct = '635988ed4e83e6af7aeebd03'
export const sellerUser = {
  userName: "ibrahim",
  password: '123',
  role: "seller"

}
export const buyerUser = {
  userName: 'ibrahim2',
  password: '123',
  role: "seller"

}

export const sellerIbrahimToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNTU0YjM2ZTRjNWZjYTA0NDY1NjFlYSIsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE2NjY3OTEyMzYsImV4cCI6MTY2OTM4MzIzNn0.p2icL2ydgzcZfUnM9iUcOtnXl_ooAW-77GJNrO34WcU"

export const buyerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNTU2ODQwNWUwYmMzYzNlZGZmZjRlNyIsInJvbGUiOiJidXllciIsImlhdCI6MTY2NjgwNDQyNywiZXhwIjoxNjY5Mzk2NDI3fQ.EnTR8M7NexhDohItnscKlx1KgJbUxeB22iuLcfKkjos"

export const unvalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNTU0YjM2ZTRjNWZjYTA0NDY1NjFlYsdcsdcsdnJvbGUiOiJzZWxsZXIiLCJpYXQiOjE2NjY3OTEyMzYsImV4cCI6MTY2OTM4MzIzNn0.p2icL2ydgzcZfUnM9iUcOtnXl_ooAW-77GJNrO34WcU"

export const missingFieldProduct = {
  "productName": "phone5",
  "amountAvailable": 20
}
export const missingFieldUser = {
  "userName": 'test',
  "password": 'test'
}
export const validUser = {
  "userName": `${Math.random()}`,
  "password": '12345',
  "role": 'buyer'
}

export const fairProduct = {
  "cost": 100,
  "productName": "phone5",
  "amountAvailable": 20
}

export const buyBody = {
  productId: '63598a38d9e27be89e828159',
  amount: 1
}

export const deletedUserToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNTk5NGYxNWQ4MjU5ODM3NTZiYTkwOCIsInJvbGUiOiJidXllciIsImlhdCI6MTY2NjgxNTIxNywiZXhwIjoxNjY5NDA3MjE3fQ.T500rdTNeA8byEOw_UEenR2zGBzzJTucIr4HQ10z3tI"

export const resetUserToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNTk5YmU5M2E5MDRlNmVlNmYwYjdiZiIsInJvbGUiOiJidXllciIsImlhdCI6MTY2NjgxNzAwMSwiZXhwIjoxNjY5NDA5MDAxfQ.wlMXKScEEmOPga0WC5UAm6QxnB2DxUz6hPDjQYEIR4c"

export const successfullyBuyObj = {
  product: expect.any(String),
  amount: expect.any(Number),
  remainedDeposit: expect.any(Number),
  change: expect.any(Array)

}

export const userObj = {
  role: expect.any(String),
  userName: expect.any(String),
  deposit: expect.any(Number)
}



export const getToken = async (userName, password) => {
  const res = await supertest(app)
    .post("/api/user/login")
    .send(buyerUser);

  return res.body.token;
};