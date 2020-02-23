import express from "express";
import { authenticateUser, registerUser } from "../modules/Auth";

const authRouter = express.Router();

// About page route.
authRouter.post("/", async function(req, res) {
  const response = await authenticateUser(req);
  res.send(response);
});

authRouter.post("/signup", async function(req, res) {
  const response = await registerUser(req);
  res.send(response);
});

module.exports = authRouter;
