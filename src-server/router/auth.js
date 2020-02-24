import express from "express";
import { authenticateUser, registerUser } from "../modules/Auth";

const authRouter = express.Router();

authRouter.use((req, res, next) => {
  if (!req.body.email || req.body.email == "") {
    res
      .status(400)
      .send("email param missing")
      .end();
  } else if (!req.body.password || req.body.password == "") {
    res
      .status(400)
      .send("password param missing")
      .end();
  } else {
    next();
  }
});

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
