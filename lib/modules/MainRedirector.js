"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redirectFromShortlink = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _MongoDbClient = require("./MongoDbClient");

var _server = require("../server");

var _moment = _interopRequireDefault(require("moment"));

/**
 * Fetch original link and redirect user
 * @param {*} req
 */
var redirectFromShortlink =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(req, res) {
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
                var shortLink, query, linkExpired;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        shortLink = req.params.shortLink; // initialize mongodb connection

                        _context.next = 4;
                        return (0, _MongoDbClient.dbConnect)("shortlinks");

                      case 4:
                        try {
                          // check redis cache for original url
                          _server.redisClient.get(shortLink, function (error, value) {
                            if (value) {
                              res.redirect(value);
                              resolve();
                            }
                          });
                        } catch (e) {
                          console.log("TCL: e", e);
                        } // query in db if redis cache is not there


                        _context.next = 7;
                        return (0, _MongoDbClient.findOne)({
                          shortLink: shortLink
                        });

                      case 7:
                        query = _context.sent;

                        if (!query) {
                          reject("Invalid link");
                        } // check date if expiration is set


                        if (query.expireAt && query.expireAt != "") {
                          linkExpired = !(0, _moment.default)().isSameOrBefore(query.expireAt);

                          if (linkExpired) {
                            reject("Link expired");
                          }
                        }

                        res.redirect(query.url);
                        resolve();
                        _context.next = 17;
                        break;

                      case 14:
                        _context.prev = 14;
                        _context.t0 = _context["catch"](0);
                        reject(_context.t0.message);

                      case 17:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[0, 14]]);
              }));

              return function (_x3, _x4) {
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

  return function redirectFromShortlink(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.redirectFromShortlink = redirectFromShortlink;