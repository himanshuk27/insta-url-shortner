import express from "express";
import { logShortLink } from "../modules/ShortLinkAnalytics";
import { redirectFromShortlink } from "../modules/MainRedirector";

const shortLinkRouter = express.Router();

shortLinkRouter.get("/:shortLink", async function(req, res) {
  await redirectFromShortlink(req, res);
  await logShortLink(req);
});

module.exports = shortLinkRouter;
