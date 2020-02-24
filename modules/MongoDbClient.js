"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = exports.findOne = exports.insertItem = exports.dbConnect = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongodb = _interopRequireDefault(require("mongodb"));

require("dotenv").config();

var url = process.env.MONGODB_URL || "http://localhost";
var port = process.env.MONGODB_PORT || "27017";
var dbName = process.env.MONGODB_DB || "admin";
var username = process.env.MONGODB_USER || "monodbUser";
var password = encodeURIComponent(process.env.MONGODB_PASSWORD || "");
var authDb = process.env.MONGODB_AUTH_DB || "admin";
var db;
var collection;
/**
 * Connect to a mongodb instance, returns mongodb client
 * @param {*} collectionName
 */

var dbConnect =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(collectionName) {
    var connectionUrl, client;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            connectionUrl = "mongodb://".concat(username, ":").concat(password, "@").concat(url, ":").concat(port, "/").concat(authDb);
            _context.next = 4;
            return _mongodb.default.connect(connectionUrl, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });

          case 4:
            client = _context.sent;
            db = client.db(dbName); // set collection object

            collection = db.collection(collectionName);
            return _context.abrupt("return", client);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            throw new Error(_context.t0.message);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));

  return function dbConnect(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Insert single row into db collection
 * @param {*} item
 */


exports.dbConnect = dbConnect;

var insertItem =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(item) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", collection.insertOne(item));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function insertItem(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.insertItem = insertItem;

var findOne =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(query) {
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", collection.findOne(query));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function findOne(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.findOne = findOne;

var find =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(query) {
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", new Promise(function (resolve, reject) {
              collection.find(query).toArray(function (err, data) {
                err ? reject(err) : resolve(data);
              });
            }));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function find(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.find = find;