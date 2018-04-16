'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElementMask = exports.LeftMask = exports.BottomMask = exports.RightMask = exports.TopMask = undefined;

var _templateObject = _taggedTemplateLiteral(['\n  background-color: rgba(0, 0, 0, 0.7);\n  width: 100%;\n  left: 0;\n  top: 0;\n  height: 100%;\n  position: fixed;\n  z-index: 99999;\n'], ['\n  background-color: rgba(0, 0, 0, 0.7);\n  width: 100%;\n  left: 0;\n  top: 0;\n  height: 100%;\n  position: fixed;\n  z-index: 99999;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n    position:fixed;\n    z-index: 99999;\n'], ['\n    position:fixed;\n    z-index: 99999;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  height: ', 'px;\n'], ['\n  height: ', 'px;\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  top: ', 'px;\n  left: ', 'px;\n  width: ', 'px;\n  height: ', 'px;\n'], ['\n  top: ', 'px;\n  left: ', 'px;\n  width: ', 'px;\n  height: ', 'px;\n']),
    _templateObject5 = _taggedTemplateLiteral(['\n  top: ', 'px;\n  height: ', 'px;\n'], ['\n  top: ', 'px;\n  height: ', 'px;\n']),
    _templateObject6 = _taggedTemplateLiteral(['\n  top: ', 'px;\n  width: ', 'px;\n  height: ', 'px;\n'], ['\n  top: ', 'px;\n  width: ', 'px;\n  height: ', 'px;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _helpers = require('../helpers');

var hx = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Mask = _styledComponents2.default.div(_templateObject);

var ElementMaskStyles = _styledComponents2.default.div(_templateObject2);

var TopMask = exports.TopMask = (0, _styledComponents2.default)(Mask)(_templateObject3, function (props) {
  return hx.safe(props.targetTop - props.padding);
});

var RightMask = exports.RightMask = (0, _styledComponents2.default)(Mask)(_templateObject4, function (props) {
  return props.targetTop - props.padding;
}, function (props) {
  return props.targetLeft + props.targetWidth + props.padding;
}, function (props) {
  return hx.safe(props.windowWidth - props.targetWidth - props.targetLeft - props.padding);
}, function (props) {
  return props.targetHeight + props.padding * 2;
});

var BottomMask = exports.BottomMask = (0, _styledComponents2.default)(Mask)(_templateObject5, function (props) {
  return props.targetHeight + props.targetTop + props.padding;
}, function (props) {
  return props.windowHeight + props.targetHeight - props.targetTop - props.padding;
});

var LeftMask = exports.LeftMask = (0, _styledComponents2.default)(Mask)(_templateObject6, function (props) {
  return props.targetTop - props.padding;
}, function (props) {
  return hx.safe(props.targetLeft - props.padding);
}, function (props) {
  return props.targetHeight + props.padding * 2;
});

var ElementMask = exports.ElementMask = (0, _styledComponents2.default)(ElementMaskStyles)(_templateObject4, function (props) {
  return props.targetTop - props.padding;
}, function (props) {
  return props.targetLeft - props.padding;
}, function (props) {
  return hx.safe(props.targetWidth + props.padding * 2);
}, function (props) {
  return props.targetHeight + props.padding * 2;
});