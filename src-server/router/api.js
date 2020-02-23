import express from "express";
import {
  generateShortLink,
  fetchUserGeneratedLinks,
  checkShortLinkAvailability
} from "../modules/ShortLink";
// import { validateJwt } from "../modules/JWToken";

const apiRouter = express.Router();

// jwt middleware
// apiRouter.use(async (req, res, next) => {
//   await validateJwt(req).catch(e => {
//     res.status(e.code).send(e);
//   });
//   next();
// });

apiRouter.post("/shortlink/create", async (req, res) => {
  const response = await generateShortLink(req);
  res.send(response);
});

apiRouter.post("/user/shortlinks", async (req, res) => {
  const response = await fetchUserGeneratedLinks(req);
  res.send(response);
});

apiRouter.post("/shortlink/check-availability", async (req, res) => {
  const response = await checkShortLinkAvailability(req);
  res.send(response);
});

module.exports = apiRouter;
