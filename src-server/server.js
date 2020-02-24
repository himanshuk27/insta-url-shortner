// dotenv module for read .env variables
require("dotenv").config();
import shortLinkRouter from "./router/shortlink";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import apiRouter from "./router/api";
import authRouter from "./router/auth";
import redis from "redis";

export const app = express();
const port = process.env.API_PORT || 3000;
// init redis client
export const redisClient = redis.createClient();
redisClient.on("error", function(error) {
  console.error(error);
});
export const redisPrint = redisClient.print;

// use cors for local testing
app.use(cors());
// use body parser to parse request parameters
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
// import shortlink router
app.use("/", shortLinkRouter);
// import api routes
app.use("/api", apiRouter);
// import auth routes
app.use("/api/auth", authRouter);

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
