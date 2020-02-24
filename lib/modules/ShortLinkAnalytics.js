"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShortlinkBrowserAnalytics = exports.logShortLink = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _moment = _interopRequireDefault(require("moment"));

var _useragent = _interopRequireDefault(require("useragent"));

var _MongoDbClient = require("./MongoDbClient");

require("dotenv").config();

/**
 * Collect basic details on every link redirect
 * @param {*} req
 */
var logShortLink =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(req) {
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
                var ip, userAgent, shortLink, dbClient, shortLinkObject, log;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        // collect user ip address
                        ip = req.header("x-forwarded-for") || req.connection.remoteAddress; // collect user agent or browser

                        userAgent = _useragent.default.parse(req.headers["user-agent"]).family;
                        shortLink = req.params.shortLink; // connect to db

                        _context.next = 6;
                        return (0, _MongoDbClient.dbConnect)("shortlinks");

                      case 6:
                        dbClient = _context.sent;
                        _context.next = 9;
                        return (0, _MongoDbClient.findOne)({
                          shortLink: shortLink
                        });

                      case 9:
                        shortLinkObject = _context.sent;
                        // close current connection
                        dbClient.close(); // connect to new collection

                        _context.next = 13;
                        return (0, _MongoDbClient.dbConnect)("analytics");

                      case 13:
                        dbClient = _context.sent;
                        log = {
                          shortLink: shortLink,
                          ownerId: shortLinkObject.userId,
                          url: shortLinkObject.url,
                          ipAddress: ip,
                          userAgent: userAgent,
                          accessTime: (0, _moment.default)().toDate()
                        }; // log into db

                        _context.next = 17;
                        return (0, _MongoDbClient.insertItem)(log);

                      case 17:
                        // close connection
                        dbClient.close();
                        resolve(log);
                        _context.next = 24;
                        break;

                      case 21:
                        _context.prev = 21;
                        _context.t0 = _context["catch"](0);
                        reject(_context.t0.message);

                      case 24:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[0, 21]]);
              }));

              return function (_x2, _x3) {
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

  return function logShortLink(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.logShortLink = logShortLink;

var getShortlinkBrowserAnalytics =
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
                var userId, data, dbClient, analytics;
                return _regenerator.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        userId = user["_id"];
                        data = []; // connect to db

                        _context3.next = 5;
                        return (0, _MongoDbClient.dbConnect)("analytics");

                      case 5:
                        dbClient = _context3.sent;
                        _context3.next = 8;
                        return (0, _MongoDbClient.find)({
                          ownerId: userId
                        });

                      case 8:
                        analytics = _context3.sent;
                        dbClient.close();
                        analytics.forEach(function (element) {
                          data.push({
                            shortLink: element.shortLink,
                            url: element.url,
                            browser: element.userAgent
                          });
                        });
                        res.send({
                          error: false,
                          message: "query complete",
                          analytics: data,
                          code: 200
                        });
                        res.end();
                        resolve();
                        _context3.next = 19;
                        break;

                      case 16:
                        _context3.prev = 16;
                        _context3.t0 = _context3["catch"](0);
                        reject(_context3.t0.message);

                      case 19:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[0, 16]]);
              }));

              return function (_x7, _x8) {
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

  return function getShortlinkBrowserAnalytics(_x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getShortlinkBrowserAnalytics = getShortlinkBrowserAnalytics;