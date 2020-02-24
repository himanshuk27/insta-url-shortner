"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _ShortLink = require("../modules/ShortLink");

var _JWToken = require("../modules/JWToken");

var _ShortLinkAnalytics = require("../modules/ShortLinkAnalytics");

require("dotenv").config();

var apiRouter = _express.default.Router();

var user = null;
apiRouter.use(function (req, res, next) {
  // jwt middleware
  if (req.path.includes("shortlink")) {
    (0, _JWToken.validateJwt)(req).then(function (result) {
      if (!result) {
        res.status(401).send("unknown error in authorising the request");
      } // set user object


      user = result;
      next();
    }).catch(function (error) {
      res.status(401).send(error);
      res.end();
    });
  } else {
    next();
  }
});
apiRouter.post("/shortlink/create", function (req, res) {
  (0, _ShortLink.generateShortLink)(req, res, user).catch(function (error) {
    res.status(error.code || 417).send(error);
    res.end();
  });
});
apiRouter.post("/user/shortlinks", function (req, res) {
  (0, _ShortLink.fetchUserGeneratedLinks)(req, res, user).catch(function (error) {
    res.status(error.code || 417).send(error);
    res.end();
  });
});
apiRouter.post("/shortlink/check-availability", function (req, res) {
  (0, _ShortLink.checkShortLinkAvailability)(req, res).catch(function (error) {
    res.status(error.code || 417).send(error);
    res.end();
  });
});
apiRouter.post("/shortlink/analytics", function (req, res) {
  (0, _ShortLinkAnalytics.getShortlinkBrowserAnalytics)(req, res, user).catch(function (error) {
    res.status(error.code || 417).send(error);
    res.end();
  });
});
module.exports = apiRouter;