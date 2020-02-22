import express from "express";
import { authenticateUser, registerUser } from "../modules/Auth";
import {
  generateShortLink,
  fetchUserGeneratedLinks,
  checkShortLinkAvailability
} from "../modules/ShortLinkGenerator";

const router = express.Router();

// About page route.
router.post("/auth", async function(req, res) {
  const response = await authenticateUser(req);
  res.send(response);
});

router.post("/auth/signup", async function(req, res) {
  const response = await registerUser(req);
  res.send(response);
});

router.post("/shortlink/create", async function(req, res) {
  const response = await generateShortLink(req);
  res.send(response);
});

router.post("/user/shortlinks", async function(req, res) {
  const response = await fetchUserGeneratedLinks(req);
  res.send(response);
});

router.post("/shortlink/check-availability", async function(req, res) {
  const response = await checkShortLinkAvailability(req);
  res.send(response);
});

router.get("/:shortLink", async function(req, res) {
  res.send("test");
});

module.exports = router;
