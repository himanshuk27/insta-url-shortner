import express from "express";
import { logShortLink } from "../modules/ShortLinkAnalytics";
import { redirectFromShortlink } from "../modules/MainRedirector";

const shortLinkRouter = express.Router();

shortLinkRouter.get("/:shortLink", async function(req, res) {
  redirectFromShortlink(req, res)
    .then(async () => {
      await logShortLink(req);
    })
    .catch(e => {
      res.status(417).send(e);
    });
});

module.exports = shortLinkRouter;
