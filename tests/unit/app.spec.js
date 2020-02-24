const app = require("../../src-server/server");
const request = require("supertest");

describe("Backend api testing", () => {
  const randomEmailId = Math.random()
    .toString(8)
    .slice(-5);
  let apiToken = null;
  let generatedShortlink = null;

  it("User signup testing...", async () => {
    const result = await request(app)
      .post("/api/auth/signup")
      .send({
        email: `${randomEmailId}@test.com`,
        password: "password123"
      });
    expect(result.body.message).toEqual("Signup complete");
  });
  it("User login incorrect password", async () => {
    const result = await request(app)
      .post("/api/auth/")
      .send({
        email: `${randomEmailId}@test.com`,
        password: "password123-wrong"
      });
    expect(result.body.message).toEqual("Incorrect password");
  });
  it("User login testing...", async () => {
    const result = await request(app)
      .post("/api/auth/")
      .send({
        email: `${randomEmailId}@test.com`,
        password: "password123"
      });
    expect(result.body.message).toEqual("Auth success");
    apiToken = result.body.token;
  });
  it("fetch user shortlinks", async () => {
    const result = await request(app)
      .post("/api/user/shortlinks")
      .set("Authorization", apiToken);
    expect(result.body.message).toEqual("query executed");
  });
  it("generate shortlink", async () => {
    const randomUrl = Math.random()
      .toString(8)
      .slice(-5);
    const randomString = Math.random()
      .toString(6)
      .slice(-5);
    const result = await request(app)
      .post("/api/shortlink/create")
      .send({
        url: `http://${randomUrl}.com`,
        expirationDate: "24-02-2020 02:20",
        customShortLink: randomString
      })
      .set("Authorization", apiToken);
    expect(result.body.message).toEqual("shortlink generated");
    generatedShortlink = result.body.shortLink;
  });
  it("check shortlink availability", async () => {
    const randomString = Math.random()
      .toString(6)
      .slice(-5);
    const result = await request(app)
      .post("/api/shortlink/check-availability")
      .send({
        customShortLink: randomString
      })
      .set("Authorization", apiToken);
    expect(result.body.message).toEqual("request complete");
  });
  it("check shortlink redirect", async () => {
    const result = await request(app)
      .get(`/${generatedShortlink}`)
      .expect("Location", /\.com\/$/);
  });
});
