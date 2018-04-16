'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _bemHelper = require('@dr/bem-helper');

var _bemHelper2 = _interopRequireDefault(_bemHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dot = function Dot(props) {
    var disabled = props.disabled,
        onClick = props.onClick,
        current = props.current,
        index = props.index,
        showNumber = props.showNumber,
        className = props.className;


    return _react2.default.createElement('button', {
        disabled: disabled,
        onClick: onClick,
        className: _bemHelper2.default.scoped(className, {
            'is-current': current === index,
            'show-number': showNumber
        })
    });
};

Dot.propTypes = {
    disabled: _propTypes2.default.bool.isRequired,
    onClick: _propTypes2.default.func.isRequired,
    current: _propTypes2.default.number.isRequired,
    index: _propTypes2.default.number.isRequired,
    showNumber: _propTypes2.default.bool.isRequired,
    className: _propTypes2.default.string.isRequired
};

exports.default = Dot;