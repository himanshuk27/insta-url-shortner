import express from "express";
import { redirectFromShortlink } from "../modules/ShortLink";
import { logShortLink } from "../modules/ShortLinkAnalytics";

const shortLinkRouter = express.Router();

shortLinkRouter.get("/:shortLink", async function(req, res) {
  redirectFromShortlink(req, res).catch(e => {
    res.status(417).send(e.message);
  });
  await logShortLink(req);
});

module.exports = shortLinkRouter;
