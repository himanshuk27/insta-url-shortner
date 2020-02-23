// https://docs.cypress.io/api/introduction/api.html

describe("Auth login/signup page", () => {
  it("Visit auth page", () => {
    cy.visit("/#/auth");
    cy.contains("Welcome to Insta Url Shortner");
  });
});
