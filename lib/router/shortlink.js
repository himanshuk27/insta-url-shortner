"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _ShortLinkAnalytics = require("../modules/ShortLinkAnalytics");

var _MainRedirector = require("../modules/MainRedirector");

var shortLinkRouter = _express.default.Router();

shortLinkRouter.get("/:shortLink",
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(req, res) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            (0, _MainRedirector.redirectFromShortlink)(req, res).then(
            /*#__PURE__*/
            (0, _asyncToGenerator2.default)(
            /*#__PURE__*/
            _regenerator.default.mark(function _callee() {
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return (0, _ShortLinkAnalytics.logShortLink)(req);

                    case 2:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }))).catch(function (e) {
              res.send(e);
              res.end();
            });

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = shortLinkRouter;