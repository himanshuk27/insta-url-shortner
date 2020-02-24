"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUser = exports.authenticateUser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _MongoDbClient = require("./MongoDbClient");

var _randomstring = _interopRequireDefault(require("randomstring"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _JWToken = require("./JWToken");

var _v = _interopRequireDefault(require("uuid/v5"));

/**
 * Authenticate user via input email and password
 * @param {*} req
 */
var authenticateUser =
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
                var email, password, dbClient, user, auth, token;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        email = req.body.email.toLowerCase();
                        password = req.body.password;
                        _context.next = 5;
                        return (0, _MongoDbClient.dbConnect)("users");

                      case 5:
                        dbClient = _context.sent;
                        _context.next = 8;
                        return (0, _MongoDbClient.findOne)({
                          email: email
                        });

                      case 8:
                        user = _context.sent;

                        // return if user not exists
                        if (!user) {
                          res.send({
                            error: true,
                            message: "Email id not exists",
                            code: 417
                          });
                          res.end();
                          resolve();
                        }

                        dbClient.close(); // very password hash

                        _context.next = 13;
                        return checkPassword(password, user.password);

                      case 13:
                        auth = _context.sent;

                        if (!auth) {
                          res.send({
                            error: true,
                            message: "Incorrect password",
                            code: 403
                          });
                          res.end();
                          resolve();
                        } // generate jwt web token


                        token = (0, _JWToken.createJwtFromUser)(user);
                        res.send({
                          error: false,
                          message: "Auth success",
                          token: token.token,
                          expireAt: token.expireAt,
                          code: 200
                        });
                        res.end();
                        resolve();
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

  return function authenticateUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * User signup by input email and password
 * @param {*} req
 */


exports.authenticateUser = authenticateUser;

var registerUser =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(req, res) {
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
                var email, password, dbClient, query, randomString, user;
                return _regenerator.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        email = req.body.email.toLowerCase();
                        _context3.next = 4;
                        return generatePasswordHash(req.body.password);

                      case 4:
                        password = _context3.sent;
                        _context3.next = 7;
                        return (0, _MongoDbClient.dbConnect)("users");

                      case 7:
                        dbClient = _context3.sent;
                        _context3.next = 10;
                        return (0, _MongoDbClient.findOne)({
                          email: email
                        });

                      case 10:
                        query = _context3.sent;

                        // return if user already exists
                        if (query) {
                          res.send({
                            error: true,
                            message: "User already exists",
                            code: 417
                          });
                          res.end();
                          resolve();
                        }

                        randomString = _randomstring.default.generate(8); // prepare user object

                        user = {
                          _id: (0, _v.default)(randomString, process.env.APP_UUID),
                          email: email,
                          password: password
                        }; // insert user object

                        _context3.next = 16;
                        return (0, _MongoDbClient.insertItem)(user);

                      case 16:
                        // close connection
                        dbClient.close();
                        res.send({
                          error: false,
                          message: "Signup complete",
                          code: 200
                        });
                        res.end();
                        resolve();
                        _context3.next = 25;
                        break;

                      case 22:
                        _context3.prev = 22;
                        _context3.t0 = _context3["catch"](0);
                        reject({
                          error: true,
                          message: _context3.t0.message,
                          code: 417
                        });

                      case 25:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[0, 22]]);
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

  return function registerUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}(); // generate secure password hash


exports.registerUser = registerUser;

var generatePasswordHash =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee6(password) {
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
                return _regenerator.default.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _bcrypt.default.genSalt(10, function (err, salt) {
                          _bcrypt.default.hash(password, salt, function (err, hash) {
                            if (err) reject(err);
                            resolve(hash);
                          });
                        });

                      case 1:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x10, _x11) {
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

  return function generatePasswordHash(_x9) {
    return _ref5.apply(this, arguments);
  };
}(); // verify given password


var checkPassword =
/*#__PURE__*/
function () {
  var _ref7 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee8(password, hash) {
    return _regenerator.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt("return", new Promise(
            /*#__PURE__*/
            function () {
              var _ref8 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee7(resolve, reject) {
                return _regenerator.default.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _bcrypt.default.compare(password, hash, function (err, result) {
                          if (err) reject(false);
                          resolve(result);
                        });

                      case 1:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x14, _x15) {
                return _ref8.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function checkPassword(_x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}();