'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Arrow = function Arrow(_ref) {
    var className = _ref.className,
        onClick = _ref.onClick,
        disabled = _ref.disabled,
        inverted = _ref.inverted,
        label = _ref.label;
    return _react2.default.createElement(
        'button',
        { className: className, onClick: onClick, disabled: disabled },
        label ? _react2.default.createElement(
            'span',
            null,
            label
        ) : _react2.default.createElement(
            'svg',
            { viewBox: '0 0 18.4 14.4' },
            _react2.default.createElement('path', {
                d: inverted ? 'M17 7.2H1M10.8 1L17 7.2l-6.2 6.2' : 'M1.4 7.2h16M7.6 1L1.4 7.2l6.2 6.2',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeMiterlimit: '10'
            })
        )
    );
};

exports.default = Arrow;