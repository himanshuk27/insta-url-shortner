import express from "express";
import {
  generateShortLink,
  fetchUserGeneratedLinks,
  checkShortLinkAvailability
} from "../modules/ShortLink";
import { validateJwt } from "../modules/JWToken";

const apiRouter = express.Router();
let user = null;

// jwt middleware
apiRouter.use((req, res, next) => {
  if (!req.path.includes("auth")) {
    validateJwt(req)
      .then(result => {
        if (!result) {
          res.status(401).send("unknown error in authorising the request");
        }
        // set user object
        user = result;
        next();
      })
      .catch(error => {
        res.status(401).send(error);
        res.end();
      });
  } else {
    next();
  }
});

apiRouter.post("/shortlink/create", (req, res) => {
  generateShortLink(req, res, user).catch(error => {
    res.status(error.code || 417).send(error);
    res.end();
  });
});

apiRouter.post("/user/shortlinks", (req, res) => {
  fetchUserGeneratedLinks(req, res, user).catch(error => {
    res.status(error.code || 417).send(error);
    res.end();
  });
});

apiRouter.post("/shortlink/check-availability", (req, res) => {
  checkShortLinkAvailability(req, res).catch(error => {
    res.status(error.code || 417).send(error);
    res.end();
  });
});

module.exports = apiRouter;
