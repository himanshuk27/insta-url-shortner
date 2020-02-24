"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateJwt = exports.createJwtFromUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _moment = _interopRequireDefault(require("moment"));

require("dotenv").config();

// Generate unique jwt auth token from user object
var createJwtFromUser = function createJwtFromUser(user) {
  try {
    var privateKey = _fs.default.readFileSync("./private.key", "utf8");

    var exp = process.env.JWT_EXP;
    var expireAt = (0, _moment.default)().add(exp.replace("h", ""), "hours").toDate();
    var signOptions = {
      expiresIn: exp,
      algorithm: "RS256"
    };
    return {
      token: _jsonwebtoken.default.sign(user, privateKey, signOptions),
      expireAt: expireAt
    };
  } catch (e) {
    return {
      error: true,
      message: e.message,
      code: 417
    };
  }
};

exports.createJwtFromUser = createJwtFromUser;

var validateJwt =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(req) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              try {
                var publicKey = _fs.default.readFileSync("./public.key", "utf8");

                var token = req.headers["authorization"];

                if (!token || token == "") {
                  reject({
                    error: true,
                    message: "Token not provided",
                    code: 417
                  });
                }

                var exp = process.env.JWT_EXP;
                var signOptions = {
                  expiresIn: exp,
                  algorithm: "RS256"
                };

                var user = _jsonwebtoken.default.verify(token, publicKey, signOptions);

                resolve(user);
              } catch (e) {
                reject({
                  error: true,
                  message: e.message,
                  code: 401
                });
              }
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function validateJwt(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.validateJwt = validateJwt;