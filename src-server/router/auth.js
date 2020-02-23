import express from "express";
import { authenticateUser, registerUser } from "../modules/Auth";

const authRouter = express.Router();

// About page route.
authRouter.post("/", (req, res) => {
  authenticateUser(req, res).catch(error => {
    res.status(error.code || 417).send(error);
    res.end();
  });
});

authRouter.post("/signup", (req, res) => {
  registerUser(req, res).catch(error => {
    res.status(error.code || 417).send(error);
    res.end();
  });
});

module.exports = authRouter;
