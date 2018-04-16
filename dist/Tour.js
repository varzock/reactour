'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _exenv = require('exenv');

var _exenv2 = _interopRequireDefault(_exenv);

var _TourPortal = require('./TourPortal');

var _TourPortal2 = _interopRequireDefault(_TourPortal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var renderSubtreeIntoContainer = _reactDom2.default.unstable_renderSubtreeIntoContainer;
var SafeHTMLElement = _exenv2.default.canUseDOM ? window.HTMLElement : {};

function getParentElement(parentSelector) {
    return parentSelector();
}

var Tour = function (_Component) {
    _inherits(Tour, _Component);

    function Tour() {
        _classCallCheck(this, Tour);

        return _possibleConstructorReturn(this, (Tour.__proto__ || Object.getPrototypeOf(Tour)).apply(this, arguments));
    }

    _createClass(Tour, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.node = document.createElement('div');
            this.node.className = this.props.portalClassName;
            var parent = getParentElement(this.props.parentSelector);
            parent.appendChild(this.node);
            this.renderPortal(this.props);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var currentParent = getParentElement(this.props.parentSelector);
            var newParent = getParentElement(nextProps.parentSelector);

            if (newParent !== currentParent) {
                currentParent.removeChild(this.node);
                newParent.appendChild(this.node);
            }

            this.renderPortal(nextProps);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.removePortal();
        }
    }, {
        key: 'removePortal',
        value: function removePortal() {
            _reactDom2.default.unmountComponentAtNode(this.node);
            var parent = getParentElement(this.props.parentSelector);
            parent.removeChild(this.node);
            document.body.classList.remove('reactour__body');
        }
    }, {
        key: 'renderPortal',
        value: function renderPortal(props) {
            if (props.isOpen) {
                document.body.classList.add('reactour__body');
            } else {
                document.body.classList.remove('reactour__body');
            }

            this.portal = renderSubtreeIntoContainer(this, _react2.default.createElement(_TourPortal2.default, props), this.node);
        }
    }, {
        key: 'render',
        value: function render() {
            return null;
        }
    }]);

    return Tour;
}(_react.Component);

Tour.propTypes = {
    isOpen: _propTypes2.default.bool.isRequired,
    portalClassName: _propTypes2.default.string,
    appElement: _propTypes2.default.instanceOf(SafeHTMLElement),
    onAfterOpen: _propTypes2.default.func,
    onRequestClose: _propTypes2.default.func,
    closeWithMask: _propTypes2.default.bool,
    parentSelector: _propTypes2.default.func
};
Tour.defaultProps = {
    isOpen: false,
    portalClassName: 'reactour-portal',
    closeWithMask: true,
    parentSelector: function parentSelector() {
        return document.body;
    }
};
exports.default = Tour;