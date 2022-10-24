import req from "express/lib/request";



export const userTests = (request, app) => {
  describe("createUser", () => {
    it("should create a new user", async () => {
      const payload = {
        userName: "omar2",
        password: "123456789",
        role: "seller",
      };
      const res = await request(app).post("/signup").send(payload);
      const data = res.body;
      expect(res.statusCode).toBe(200);
      const { password, ...rest } = payload;
      expect(data).toMatchObject({ ...rest, token: expect.any(String) });
    })
  })
}