const app = require("../../src-server/server");
const request = require("supertest");

describe("GET / - a simple api endpoint", () => {
  it("Hello API Request", async () => {
    const result = await request(app).post("/api/auth");
    expect(result.statusCode).toEqual(200);
  });
});
