"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _Auth = require("../modules/Auth");

var authRouter = _express.default.Router();

authRouter.use(function (req, res, next) {
  if (!req.body.email || req.body.email == "") {
    res.status(400).send("email param missing").end();
  } else if (!req.body.password || req.body.password == "") {
    res.status(400).send("password param missing").end();
  } else {
    next();
  }
}); // About page route.

authRouter.post("/", function (req, res) {
  (0, _Auth.authenticateUser)(req, res).catch(function (error) {
    res.status(error.code || 417).send(error);
    res.end();
  });
});
authRouter.post("/signup", function (req, res) {
  (0, _Auth.registerUser)(req, res).catch(function (error) {
    res.status(error.code || 417).send(error);
    res.end();
  });
});
module.exports = authRouter;