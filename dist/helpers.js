'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bestPositionOf = exports.safe = exports.isOutsideY = exports.isOutsideX = exports.isHoriz = exports.isBody = exports.inView = exports.getNodeRect = undefined;

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getNodeRect = exports.getNodeRect = function getNodeRect(node) {
    return (0, _lodash2.default)(node.getBoundingClientRect(), ['top', 'right', 'bottom', 'left', 'width', 'height']);
};

var inView = exports.inView = function inView(_ref) {
    var top = _ref.top,
        right = _ref.right,
        bottom = _ref.bottom,
        left = _ref.left,
        w = _ref.w,
        h = _ref.h,
        _ref$threshold = _ref.threshold,
        threshold = _ref$threshold === undefined ? 0 : _ref$threshold;

    return top >= 0 + threshold && left >= 0 + threshold && bottom <= h - threshold && right <= w - threshold;
};

var isBody = exports.isBody = function isBody(node) {
    return node === document.querySelector('body');
};
var isHoriz = exports.isHoriz = function isHoriz(pos) {
    return (/(left|right)/.test(pos)
    );
};
var isOutsideX = exports.isOutsideX = function isOutsideX(val, windowWidth) {
    return val > windowWidth;
};
var isOutsideY = exports.isOutsideY = function isOutsideY(val, windowHeight) {
    return val > windowHeight;
};
var safe = exports.safe = function safe(sum) {
    return sum < 0 ? 0 : sum;
};

var bestPositionOf = exports.bestPositionOf = function bestPositionOf(positions) {
    return Object.keys(positions).map(function (p) {
        return {
            position: p,
            value: positions[p]
        };
    }).sort(function (a, b) {
        return b.value - a.value;
    }).map(function (p) {
        return p.position;
    });
};