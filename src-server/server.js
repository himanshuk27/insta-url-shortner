// dotenv module for read .env variables
require("dotenv").config();
import shortLinkRouter from "./router/shortlink";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import apiRouter from "./router/api";
import authRouter from "./router/auth";
import redis from "redis";
import helmet from "helmet";
import { RateLimiterRedis } from "rate-limiter-flexible";

export const app = express();
const port = process.env.PORT || 3000;
// init redis client
export const redisClient = redis.createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT
});
redisClient.on("error", function(error) {
  console.error(error);
});
export const redisPrint = redisClient.print;

app.use(helmet());

export const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  points: 5, // Number of points
  duration: 5 // Per second(s)
});

app.use(cors({ origin: true }));

// use body parser to parse request parameters
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

const appRouter = express.Router();

appRouter.use((req, res, next) => {
  // redis rate limiter
  const rateLimiterMiddleware = (req, res, next) => {
    rateLimiterRedis
      .consume(req.ip)
      .then(() => {
        next();
      })
      .catch(_ => {
        res.status(429).send("Too Many Requests");
      });
  };
});
// import shortlink router
app.use("/", shortLinkRouter);
// import api routes
app.use("/api", apiRouter);
// import auth routes
app.use("/api/auth", authRouter);

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
