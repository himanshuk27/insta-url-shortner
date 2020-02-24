"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkShortLinkAvailability = exports.fetchUserGeneratedLinks = exports.generateShortLink = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _v = _interopRequireDefault(require("uuid/v5"));

var _MongoDbClient = require("./MongoDbClient");

var _moment = _interopRequireDefault(require("moment"));

var _randomstring = _interopRequireDefault(require("randomstring"));

var _server = require("../server");

require("dotenv").config();

/**
 * Generate short link from url function
 * @param {*} req
 */
var generateShortLink =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(req, res, user) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee(resolve, reject) {
                var url, userId, customShortLink, expirationDate, dbClient, shortlinkExists, expireAt, uniqueIdentifier, shortLink, shortLinkObject;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        // user input url
                        url = new URL(req.body.url).toString();
                        userId = user["_id"];
                        customShortLink = req.body.customShortLink;
                        expirationDate = req.body.expirationDate; // return if not url provided

                        if (!url || url == "") {
                          res.send({
                            error: true,
                            message: "url parameter is required",
                            code: 417
                          });
                          res.end();
                          resolve();
                        } // initialize mongodb connection


                        _context.next = 8;
                        return (0, _MongoDbClient.dbConnect)("shortlinks");

                      case 8:
                        dbClient = _context.sent;
                        _context.next = 11;
                        return (0, _MongoDbClient.findOne)({
                          userId: userId,
                          url: url
                        });

                      case 11:
                        shortlinkExists = _context.sent;

                        // return if short link already generated
                        if (shortlinkExists) {
                          dbClient.close();
                          res.send({
                            error: true,
                            message: "Shortlink already exists",
                            shortLink: shortlinkExists,
                            code: 200
                          });
                          res.end();
                          resolve();
                        }

                        expireAt = expirationDate && expirationDate != "" ? (0, _moment.default)(req.body.expirationDate, "DD-MMM-YYYY HH:mm").toDate() : null;
                        uniqueIdentifier = _randomstring.default.generate(6);
                        shortLink = customShortLink && customShortLink != "" ? customShortLink : uniqueIdentifier;
                        shortLinkObject = {
                          _id: (0, _v.default)(uniqueIdentifier, process.env.APP_UUID),
                          url: url,
                          userId: userId,
                          shortLink: shortLink,
                          expireAt: expireAt,
                          createdAt: (0, _moment.default)().toDate()
                        }; // insert into db

                        _context.next = 19;
                        return (0, _MongoDbClient.insertItem)(shortLinkObject);

                      case 19:
                        // close connection
                        dbClient.close();

                        try {
                          // save shortlink to redis cache
                          _server.redisClient.set(shortLink, url);
                        } catch (e) {
                          console.log("TCL: e", e);
                        }

                        res.send({
                          error: false,
                          message: "shortlink generated",
                          shortLink: shortLink,
                          code: 200
                        });
                        res.end();
                        resolve();
                        _context.next = 29;
                        break;

                      case 26:
                        _context.prev = 26;
                        _context.t0 = _context["catch"](0);
                        reject(_context.t0.message);

                      case 29:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[0, 26]]);
              }));

              return function (_x4, _x5) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function generateShortLink(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Fetch user past links
 * @param {*} req
 */


exports.generateShortLink = generateShortLink;

var fetchUserGeneratedLinks =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(req, res, user) {
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", new Promise(
            /*#__PURE__*/
            function () {
              var _ref4 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee3(resolve, reject) {
                var userId, shortlinks;
                return _regenerator.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        userId = user["_id"]; // initialize mongodb connection

                        _context3.next = 4;
                        return (0, _MongoDbClient.dbConnect)("shortlinks");

                      case 4:
                        _context3.next = 6;
                        return (0, _MongoDbClient.find)({
                          userId: userId
                        });

                      case 6:
                        shortlinks = _context3.sent;
                        res.send({
                          error: false,
                          message: "query executed",
                          shortlinks: shortlinks,
                          code: 200
                        });
                        res.end();
                        resolve();
                        _context3.next = 15;
                        break;

                      case 12:
                        _context3.prev = 12;
                        _context3.t0 = _context3["catch"](0);
                        reject(_context3.t0.message);

                      case 15:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[0, 12]]);
              }));

              return function (_x9, _x10) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function fetchUserGeneratedLinks(_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Check if user custom link is available
 * @param {*} req
 */


exports.fetchUserGeneratedLinks = fetchUserGeneratedLinks;

var checkShortLinkAvailability =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee6(req, res) {
    return _regenerator.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt("return", new Promise(
            /*#__PURE__*/
            function () {
              var _ref6 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee5(resolve, reject) {
                var shortLink, query;
                return _regenerator.default.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.prev = 0;
                        shortLink = req.body.customShortLink; // initialize mongodb connection

                        _context5.next = 4;
                        return (0, _MongoDbClient.dbConnect)("shortlinks");

                      case 4:
                        _context5.next = 6;
                        return (0, _MongoDbClient.findOne)({
                          shortLink: shortLink
                        });

                      case 6:
                        query = _context5.sent;
                        res.send({
                          error: false,
                          message: "request complete",
                          match: query ? true : false,
                          code: 200
                        });
                        res.end();
                        resolve();
                        _context5.next = 15;
                        break;

                      case 12:
                        _context5.prev = 12;
                        _context5.t0 = _context5["catch"](0);
                        reject(_context5.t0.message);

                      case 15:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5, null, [[0, 12]]);
              }));

              return function (_x13, _x14) {
                return _ref6.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function checkShortLinkAvailability(_x11, _x12) {
    return _ref5.apply(this, arguments);
  };
}();

exports.checkShortLinkAvailability = checkShortLinkAvailability;