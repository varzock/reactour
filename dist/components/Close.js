'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Close = function Close(_ref) {
    var className = _ref.className,
        onClick = _ref.onClick;
    return _react2.default.createElement(
        'button',
        { className: className, onClick: onClick },
        _react2.default.createElement(
            'svg',
            { width: '100%', viewBox: '0 0 9.1 9.1' },
            _react2.default.createElement('path', {
                fill: 'currentColor',
                d: 'M5.9 4.5l2.8-2.8c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L4.5 3.1 1.7.3C1.3-.1.7-.1.3.3c-.4.4-.4 1 0 1.4l2.8 2.8L.3 7.4c-.4.4-.4 1 0 1.4.2.2.4.3.7.3s.5-.1.7-.3L4.5 6l2.8 2.8c.3.2.5.3.8.3s.5-.1.7-.3c.4-.4.4-1 0-1.4L5.9 4.5z'
            })
        )
    );
};

Close.propTypes = {
    className: _propTypes2.default.string.isRequired,
    onClick: _propTypes2.default.func.isRequired
};

exports.default = Close;