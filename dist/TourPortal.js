'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _bemHelper = require('@dr/bem-helper');

var _bemHelper2 = _interopRequireDefault(_bemHelper);

var _scrollSmooth = require('scroll-smooth');

var _scrollSmooth2 = _interopRequireDefault(_scrollSmooth);

var _scrollparent = require('scrollparent');

var _scrollparent2 = _interopRequireDefault(_scrollparent);

var _index = require('./components/index');

var _helpers = require('./helpers');

var hx = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var setNodeState = function setNodeState(node, helper, position) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var _hx$getNodeRect = hx.getNodeRect(helper),
        helperWidth = _hx$getNodeRect.width,
        helperHeight = _hx$getNodeRect.height;

    var attrs = node ? hx.getNodeRect(node) : {
        top: h + 10,
        right: w / 2 + 9,
        bottom: h / 2 + 9,
        left: w / 2 - helperWidth / 2,
        width: 0,
        height: 0,
        w: w,
        h: h,
        helperPosition: 'center'
    };

    return function update(state) {
        return _extends({
            w: w,
            h: h,
            helperWidth: helperWidth,
            helperHeight: helperHeight,
            helperPosition: position
        }, attrs, {
            inDOM: !!node
        });
    };
};

var TourPortal = function (_Component) {
    _inherits(TourPortal, _Component);

    function TourPortal() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, TourPortal);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TourPortal.__proto__ || Object.getPrototypeOf(TourPortal)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            isOpen: false,
            current: 0,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: 0,
            height: 0,
            w: 0,
            h: 0,
            inDOM: false,
            observer: null
        }, _this.showStep = function () {
            var steps = _this.props.steps;
            var current = _this.state.current;

            var step = steps[current];
            var node = document.querySelector(step.selector);

            var stepCallback = function stepCallback(o) {
                if (step.action && typeof step.action === 'function') {
                    step.action(o);
                }
            };

            if (step.observe) {
                var target = document.querySelector(step.observe);
                var config = { attributes: true, childList: true, characterData: true };
                _this.setState({
                    observer: new MutationObserver(function (mutations) {
                        mutations.forEach(function (mutation) {
                            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                var cb = function cb() {
                                    return stepCallback(mutation.addedNodes[0]);
                                };
                                setTimeout(function () {
                                    return _this.calculateNode(mutation.addedNodes[0], step.position, cb);
                                }, 100);
                            } else if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                                var _cb = function _cb() {
                                    return stepCallback(node);
                                };
                                _this.calculateNode(node, step.position, _cb);
                            }
                        });
                    })
                }, function () {
                    return _this.state.observer.observe(target, config);
                });
            } else if (_this.state.observer) {
                _this.state.observer.disconnect();
                _this.setState({
                    observer: null
                });
            }

            if (node) {
                var cb = function cb() {
                    return stepCallback(node);
                };
                _this.calculateNode(node, step.position, cb);
            } else {
                _this.setState(setNodeState(null, _this.helper, step.position), stepCallback);
                console.warn('Can\'t find a DOM node `' + step.selector + '`.\nPlease check the `steps` Tour prop Array at position: ' + (current + 1) + '.');
            }
        }, _this.getViewportOffset = function (element) {
            var left = element.offsetLeft;
            var top = element.offsetTop;
            //let node = element;

            var node = element.parentNode;

            do {
                var styles = getComputedStyle(node);

                if (styles) {
                    var position = styles.getPropertyValue('position');

                    left -= node.scrollLeft;
                    top -= node.scrollTop;

                    if (/relative|absolute|fixed/.test(position)) {
                        left += parseInt(styles.getPropertyValue('border-left-width'), 10);
                        top += parseInt(styles.getPropertyValue('border-top-width'), 10);

                        left += node.offsetLeft;
                        top += node.offsetTop;
                    }

                    node = position === 'fixed' ? null : node.parentNode;
                } else {
                    node = node.parentNode;
                }
            } while (node);

            return { left: left, top: top };
        }, _this.calculateNode = function (node, stepPosition, cb) {
            var _this$props = _this.props,
                scrollDuration = _this$props.scrollDuration,
                inViewThreshold = _this$props.inViewThreshold,
                scrollOffset = _this$props.scrollOffset;

            var attrs = hx.getNodeRect(node);
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            /*const nodeStyles = getComputedStyle(node);
            const helperStyles = getComputedStyle(this.helper);*/
            //console.log(this.getViewportOffset(node));
            if (!hx.inView(_extends({}, attrs, { w: w, h: h, threshold: inViewThreshold
            }))) {
                var parentScroll = (0, _scrollparent2.default)(node);
                _scrollSmooth2.default.to(node, {
                    context: hx.isBody(parentScroll) ? window : parentScroll,
                    duration: scrollDuration,
                    offset: scrollOffset || -(h / 2),
                    callback: function callback(nd) {
                        _this.setState(setNodeState(nd, _this.helper, stepPosition), cb);
                    }
                });
            } else {
                _this.setState(setNodeState(node, _this.helper, stepPosition), cb);
            }
        }, _this.maskClickHandler = function (e) {
            var _this$props2 = _this.props,
                closeWithMask = _this$props2.closeWithMask,
                onRequestClose = _this$props2.onRequestClose;

            if (closeWithMask) {
                onRequestClose(e);
            }
        }, _this.nextStep = function () {
            var steps = _this.props.steps;

            _this.setState(function (prevState) {
                var nextStep = prevState.current < steps.length - 1 ? prevState.current + 1 : prevState.current;
                return {
                    current: nextStep
                };
            }, _this.showStep);
        }, _this.prevStep = function () {
            var steps = _this.props.steps;

            _this.setState(function (prevState) {
                var nextStep = prevState.current > 0 ? prevState.current - 1 : prevState.current;
                return {
                    current: nextStep
                };
            }, _this.showStep);
        }, _this.gotoStep = function (n) {
            var steps = _this.props.steps;

            _this.setState(function (prevState) {
                var nextStep = steps[n] ? n : prevState.current;
                return {
                    current: nextStep
                };
            }, _this.showStep);
        }, _this.keyDownHandler = function (e) {
            var onRequestClose = _this.props.onRequestClose;

            e.stopPropagation();

            // ESC pressed
            if (e.keyCode === 27) {
                // esc
                e.preventDefault();
                onRequestClose();
            }

            // Right arrow pressed
            if (e.keyCode === 39) {
                // rioght
                e.preventDefault();
                _this.nextStep();
            }

            // Left arrow pressed
            if (e.keyCode === 37) {
                // left
                e.preventDefault();
                _this.prevStep();
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(TourPortal, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var isOpen = this.props.isOpen;

            if (isOpen) {
                this.open();
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _props = this.props,
                isOpen = _props.isOpen,
                update = _props.update,
                updateDelay = _props.updateDelay;


            if (!isOpen && nextProps.isOpen) {
                this.open();
            } else if (isOpen && !nextProps.isOpen) {
                this.close();
            }

            if (isOpen && update !== nextProps.update) {
                if (nextProps.steps[this.state.current]) {
                    setTimeout(this.showStep, updateDelay);
                } else {
                    this.props.onRequestClose();
                }
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            var isOpen = this.props.isOpen;

            if (isOpen) {
                this.close();
            }
        }
    }, {
        key: 'onBeforeClose',
        value: function onBeforeClose() {
            var onBeforeClose = this.props.onBeforeClose;

            if (onBeforeClose) {
                onBeforeClose();
            }
        }
    }, {
        key: 'open',
        value: function open() {
            var _this2 = this;

            var _props2 = this.props,
                isOpen = _props2.isOpen,
                onAfterOpen = _props2.onAfterOpen,
                startAt = _props2.startAt;

            this.setState(function (prevState) {
                return {
                    isOpen: true,
                    current: startAt !== undefined ? startAt : prevState.current
                };
            }, function () {
                _this2.showStep();
                _this2.helper.focus();
                if (onAfterOpen) onAfterOpen();
            });
            // TODO: debounce it.
            window.addEventListener('resize', this.showStep, false);
            window.addEventListener('keydown', this.keyDownHandler, false);
        }
    }, {
        key: 'close',
        value: function close() {
            this.setState(function (prevState) {
                if (prevState.observer) {
                    prevState.observer.disconnect();
                }
                return {
                    isOpen: false,
                    observer: null
                };
            }, this.onBeforeClose);
            window.removeEventListener('resize', this.showStep);
            window.removeEventListener('keydown', this.keyDownHandler);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props3 = this.props,
                badgeName = _props3.badgeName,
                className = _props3.className,
                steps = _props3.steps,
                maskName = _props3.maskName,
                helperName = _props3.helperName,
                controlsName = _props3.controlsName,
                showButtons = _props3.showButtons,
                arrowName = _props3.arrowName,
                labelName = _props3.labelName,
                showNavigation = _props3.showNavigation,
                showNavigationNumber = _props3.showNavigationNumber,
                navigationClassName = _props3.navigationClassName,
                showNumber = _props3.showNumber,
                dotClassName = _props3.dotClassName,
                closeButtonClassName = _props3.closeButtonClassName,
                onRequestClose = _props3.onRequestClose,
                maskSpace = _props3.maskSpace,
                lastStepNextButton = _props3.lastStepNextButton,
                badgeContent = _props3.badgeContent,
                highlightedMaskClassName = _props3.highlightedMaskClassName,
                disableInteraction = _props3.disableInteraction,
                locale = _props3.locale,
                components = _props3.components;
            var nextButton = locale.nextButton,
                prevButton = locale.prevButton;
            var _state = this.state,
                isOpen = _state.isOpen,
                current = _state.current,
                inDOM = _state.inDOM,
                targetTop = _state.top,
                targetRight = _state.right,
                targetBottom = _state.bottom,
                targetLeft = _state.left,
                targetWidth = _state.width,
                targetHeight = _state.height,
                windowWidth = _state.w,
                windowHeight = _state.h,
                helperWidth = _state.helperWidth,
                helperHeight = _state.helperHeight,
                helperPosition = _state.helperPosition;


            console.log(this.state);

            // By default the prev button calls the prevStep function
            var onPrevArrowClick = this.prevStep;
            var isPrevArrowDisabled = current === 0;
            var prevArrowLabel = prevButton || null;

            // Which class name to use
            var prevArrowName = prevArrowLabel !== null ? labelName : arrowName;
            // Are we using a custom component for the prev arrow
            var PrevArrow = components.PrevArrow ? components.PrevArrow : function () {
                return _react2.default.createElement(_index.Arrow, {
                    className: _bemHelper2.default.scoped(className, prevArrowName),
                    onClick: onPrevArrowClick,
                    disabled: isPrevArrowDisabled,
                    label: prevArrowLabel
                });
            };

            // By default the next button calls the nextStep function
            var onNextArrowClick = this.nextStep;
            var isLastStep = current === steps.length - 1;
            if (isLastStep) {
                var noop = function noop() {};
                onNextArrowClick = lastStepNextButton ? onRequestClose : noop;
            }
            var isNextArrowDisabled = !lastStepNextButton && current === steps.length - 1;
            var nextArrowLabel = lastStepNextButton && isLastStep ? lastStepNextButton : nextButton || null;

            // Which class name to use
            var nextArrowName = nextArrowLabel !== null ? labelName : arrowName;
            // Are we using a custom component for the next arrow
            var NextArrow = components.NextArrow ? components.NextArrow : function () {
                return _react2.default.createElement(_index.Arrow, {
                    className: _bemHelper2.default.scoped(className, nextArrowName, {
                        next: true,
                        label: nextArrowLabel !== null
                    }),
                    onClick: onNextArrowClick,
                    disabled: isNextArrowDisabled,
                    inverted: true,
                    label: nextArrowLabel
                });
            };

            // Custom dot component in use?
            var NavigationDot = components.Dot ? components.Dot : _index.Dot;

            // Are we using a custom component for the close button?
            var CloseButton = components.CloseButton ? components.CloseButton : _index.Close;

            if (isOpen) {
                return _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'div',
                        {
                            role: 'button',
                            ref: function ref(c) {
                                return _this3.mask = c;
                            },
                            onClick: this.maskClickHandler,
                            className: _bemHelper2.default.scoped(className, maskName, {
                                'is-open': isOpen
                            })
                        },
                        _react2.default.createElement(_index.TopMask, {
                            targetTop: targetTop,
                            padding: maskSpace,
                            className: maskName
                        }),
                        _react2.default.createElement(_index.RightMask, {
                            targetTop: targetTop,
                            targetLeft: targetLeft,
                            targetWidth: targetWidth,
                            targetHeight: targetHeight,
                            windowWidth: windowWidth,
                            padding: maskSpace,
                            className: maskName
                        }),
                        _react2.default.createElement(_index.BottomMask, {
                            targetHeight: targetHeight,
                            targetTop: targetTop,
                            windowHeight: windowHeight,
                            padding: maskSpace,
                            className: maskName
                        }),
                        _react2.default.createElement(_index.LeftMask, {
                            targetHeight: targetHeight,
                            targetTop: targetTop,
                            targetLeft: targetLeft,
                            padding: maskSpace,
                            className: maskName
                        })
                    ),
                    disableInteraction && _react2.default.createElement(_index.ElementMask, {
                        targetTop: targetTop,
                        targetLeft: targetLeft,
                        targetWidth: targetWidth,
                        targetHeight: targetHeight,
                        padding: maskSpace,
                        className: highlightedMaskClassName
                    }),
                    _react2.default.createElement(
                        _index.Guide,
                        {
                            innerRef: function innerRef(c) {
                                return _this3.helper = c;
                            },
                            targetHeight: targetHeight,
                            targetWidth: targetWidth,
                            targetTop: targetTop,
                            targetRight: targetRight,
                            targetBottom: targetBottom,
                            targetLeft: targetLeft,
                            windowWidth: windowWidth,
                            windowHeight: windowHeight,
                            helperWidth: helperWidth,
                            helperHeight: helperHeight,
                            helperPosition: helperPosition,
                            padding: maskSpace,
                            tabIndex: -1,
                            current: current,
                            style: steps[current].style ? steps[current].style : {},
                            className: _bemHelper2.default.scoped(className, helperName, {
                                'is-open': isOpen
                            })
                        },
                        steps[current] && (typeof steps[current].content === 'function' ? steps[current].content({
                            goTo: this.gotoStep,
                            inDOM: inDOM,
                            step: current + 1
                        }) : steps[current].content),
                        showNumber && _react2.default.createElement(
                            'span',
                            {
                                className: _bemHelper2.default.scoped(className, badgeName)
                            },
                            typeof badgeContent === 'function' ? badgeContent(current + 1, steps.length) : current + 1
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: _bemHelper2.default.scoped(className, controlsName) },
                            showButtons && _react2.default.createElement(PrevArrow, {
                                onClick: onPrevArrowClick,
                                disabled: isPrevArrowDisabled
                            }),
                            showNavigation && _react2.default.createElement(
                                'nav',
                                { className: _bemHelper2.default.scoped(className, navigationClassName) },
                                steps.map(function (s, i) {
                                    return _react2.default.createElement(NavigationDot, {
                                        key: s.selector + '_' + i,
                                        onClick: function onClick() {
                                            return _this3.gotoStep(i);
                                        },
                                        current: current,
                                        index: i,
                                        disabled: current === i,
                                        showNumber: showNavigationNumber,
                                        className: _bemHelper2.default.scoped(className, dotClassName)
                                    });
                                })
                            ),
                            showButtons && _react2.default.createElement(NextArrow, {
                                onClick: onNextArrowClick,
                                disabled: isNextArrowDisabled
                            })
                        ),
                        _react2.default.createElement(CloseButton, {
                            onClick: onRequestClose,
                            className: _bemHelper2.default.scoped(className, closeButtonClassName)
                        })
                    )
                );
            }

            return _react2.default.createElement('div', null);
        }
    }]);

    return TourPortal;
}(_react.Component);

TourPortal.propTypes = {
    badgeContent: _propTypes2.default.func,
    badgeName: _propTypes2.default.string,
    highlightedMaskClassName: _propTypes2.default.string,
    className: _propTypes2.default.string,
    closeWithMask: _propTypes2.default.bool,
    inViewThreshold: _propTypes2.default.number,
    isOpen: _propTypes2.default.bool.isRequired,
    lastStepNextButton: _propTypes2.default.string,
    helperName: _propTypes2.default.string,
    maskName: _propTypes2.default.string,
    maskSpace: _propTypes2.default.number,
    controlsName: _propTypes2.default.string,
    onAfterOpen: _propTypes2.default.func,
    onBeforeClose: _propTypes2.default.func,
    closeButtonClassName: _propTypes2.default.string,
    onRequestClose: _propTypes2.default.func,
    scrollDuration: _propTypes2.default.number,
    scrollOffset: _propTypes2.default.number,
    showButtons: _propTypes2.default.bool,
    arrowName: _propTypes2.default.string,
    labelName: _propTypes2.default.string,
    showNavigation: _propTypes2.default.bool,
    showNavigationNumber: _propTypes2.default.bool,
    navigationClassName: _propTypes2.default.string,
    showNumber: _propTypes2.default.bool,
    dotClassName: _propTypes2.default.string,
    startAt: _propTypes2.default.number,
    steps: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        selector: _propTypes2.default.string.isRequired,
        content: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.element, _propTypes2.default.func]).isRequired,
        position: _propTypes2.default.oneOf(['top', 'right', 'bottom', 'left', 'center']),
        action: _propTypes2.default.func,
        style: _propTypes2.default.object
    })),
    update: _propTypes2.default.string,
    updateDelay: _propTypes2.default.number,
    disableInteraction: _propTypes2.default.bool,
    components: _propTypes2.default.shape({
        NextArrow: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
        PrevArrow: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
        Dot: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
        CloseButton: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
    }),
    locale: _propTypes2.default.shape({
        nextButton: _propTypes2.default.string,
        prevButton: _propTypes2.default.string
    })
};
TourPortal.defaultProps = {
    badgeName: 'badge',
    className: 'c-reactour',
    onAfterOpen: function onAfterOpen() {
        document.body.style.overflowY = 'hidden';
    },
    onBeforeClose: function onBeforeClose() {
        document.body.style.overflowY = 'auto';
    },
    onRequestClose: function onRequestClose() {},
    closeButtonClassName: 'close-button',
    showNavigation: true,
    showNavigationNumber: true,
    navigationClassName: 'navigation',
    showButtons: true,
    arrowName: 'arrow',
    labelName: 'label',
    showNumber: true,
    dotClassName: 'dot',
    scrollDuration: 1,
    scrollOffset: 0,
    helperName: 'helper',
    maskName: 'mask',
    maskSpace: 10,
    controlsName: 'controls',
    updateDelay: 1,
    disableInteraction: false,
    locale: {
        nextButton: '',
        prevButton: ''
    },
    components: {
        NextArrow: null,
        PrevArrow: null,
        Dot: null,
        CloseButton: null
    }
};
exports.default = TourPortal;