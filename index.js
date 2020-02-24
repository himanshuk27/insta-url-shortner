"use strict";
// dotenv module for read .env variables
require("dotenv").config();

var functions = require("firebase-functions");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rateLimiterRedis = exports.redisPrint = exports.redisClient = exports.app = void 0;

var _shortlink = _interopRequireDefault(require("./router/shortlink"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireDefault(require("express"));

var _api = _interopRequireDefault(require("./router/api"));

var _auth = _interopRequireDefault(require("./router/auth"));

var _redis = _interopRequireDefault(require("redis"));

var _helmet = _interopRequireDefault(require("helmet"));

var _rateLimiterFlexible = require("rate-limiter-flexible");

var app = (0, _express.default)();
exports.app = app;
var port = process.env.API_PORT || 3000; // init redis client

var redisClient = _redis.default.createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT
});

exports.redisClient = redisClient;
redisClient.on("error", function(error) {
  console.error(error);
});
var redisPrint = redisClient.print;
exports.redisPrint = redisPrint;
app.use((0, _helmet.default)());
var rateLimiterRedis = new _rateLimiterFlexible.RateLimiterRedis({
  storeClient: redisClient,
  points: 5,
  // Number of points
  duration: 5 // Per second(s)
});
exports.rateLimiterRedis = rateLimiterRedis;
app.use(
  (0, _cors.default)({
    origin: true
  })
); // use body parser to parse request parameters

app.use(
  _bodyParser.default.urlencoded({
    extended: true
  })
);
app.use(_bodyParser.default.json());

var appRouter = _express.default.Router();

appRouter.use(function(req, res, next) {
  // redis rate limiter
  var rateLimiterMiddleware = function rateLimiterMiddleware(req, res, next) {
    rateLimiterRedis
      .consume(req.ip)
      .then(function() {
        next();
      })
      .catch(function(_) {
        res.status(429).send("Too Many Requests");
      });
  };
}); // import shortlink router

app.use("/", _shortlink.default); // import api routes

app.use("/api", _api.default); // import auth routes

app.use("/api/auth", _auth.default);
app.listen(port, function() {
  return console.log("App listening on port ".concat(port, "!"));
});
module.exports = app;

exports.app = functions.https.onRequest(app);
