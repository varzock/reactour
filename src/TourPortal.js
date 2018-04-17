import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bem from '@dr/bem-helper';
import scrollSmooth from 'scroll-smooth';
import Scrollparent from 'scrollparent';
import {
    Arrow,
    Close,
    Guide,
    TopMask,
    RightMask,
    BottomMask,
    LeftMask,
    ElementMask,
    Dot,
} from './components/index';
import * as hx from './helpers';

const DEFAULT_LAYOUT = 'default';
const MINIMAL_LAYOUT = 'minimal';

const setNodeState = (node, helper, position) => {
    const w = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0,
    );
    const h = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0,
    );
    const { width: helperWidth, height: helperHeight } = hx.getNodeRect(helper);
    const attrs = node
        ? hx.getNodeRect(node)
        : {
            top: h + 10,
            right: (w / 2) + 9,
            bottom: (h / 2) + 9,
            left: (w / 2) - (helperWidth / 2),
            width: 0,
            height: 0,
            w,
            h,
            helperPosition: 'center',
        };

    return function update(state) {
        return {
            w,
            h,
            helperWidth,
            helperHeight,
            helperPosition: position,
            ...attrs,
            inDOM: !!node,
        };
    };
};

class TourPortal extends Component {
    static propTypes = {
        className: PropTypes.string,
        highlightedMaskClassName: PropTypes.string,
        closeWithMask: PropTypes.bool,
        inViewThreshold: PropTypes.number,
        isOpen: PropTypes.bool.isRequired,
        helperName: PropTypes.string,
        contentName: PropTypes.string,
        maskName: PropTypes.string,
        maskSpace: PropTypes.number,
        controlsName: PropTypes.string,
        onAfterOpen: PropTypes.func,
        onBeforeClose: PropTypes.func,
        closeButtonClassName: PropTypes.string,
        onRequestClose: PropTypes.func,
        scrollDuration: PropTypes.number,
        scrollOffset: PropTypes.number,
        showButtons: PropTypes.bool,
        buttonName: PropTypes.string,
        showProgress: PropTypes.bool,
        showProgressNumber: PropTypes.bool,
        navigationClassName: PropTypes.string,
        dotClassName: PropTypes.string,
        startAt: PropTypes.number,
        steps: PropTypes.arrayOf(PropTypes.shape({
            selector: PropTypes.string.isRequired,
            content: PropTypes.oneOfType([
                PropTypes.node,
                PropTypes.element,
                PropTypes.func,
            ]).isRequired,
            position: PropTypes.oneOf(['top', 'right', 'bottom', 'left', 'center']),
            action: PropTypes.func,
            style: PropTypes.object,
        })),
        update: PropTypes.string,
        updateDelay: PropTypes.number,
        disableInteraction: PropTypes.bool,
        components: PropTypes.shape({
            NextButton: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
            PrevButton: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
            Dot: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
            CloseButton: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
        }),
        locale: PropTypes.shape({
            skip: PropTypes.string,
            next: PropTypes.string,
            back: PropTypes.string,
            last: PropTypes.string,
        }),
        layout: PropTypes.oneOf([DEFAULT_LAYOUT, MINIMAL_LAYOUT]),
    };

    static defaultProps = {
        className: 'reactour',
        onAfterOpen: () => {
            document.body.style.overflowY = 'hidden';
        },
        onBeforeClose: () => {
            document.body.style.overflowY = 'auto';
        },
        onRequestClose: () => {},
        closeButtonClassName: 'close-button',
        showProgress: true,
        showProgressNumber: true,
        navigationClassName: 'navigation',
        showButtons: true,
        buttonName: 'button',
        dotClassName: 'dot',
        scrollDuration: 1,
        scrollOffset: 0,
        helperName: 'helper',
        contentName: 'content',
        maskName: 'mask',
        maskSpace: 10,
        controlsName: 'controls',
        updateDelay: 1,
        disableInteraction: false,
        locale: {
            close: 'Close',
            skip: 'Skip',
            next: 'Next',
            back: 'Back',
            last: 'Last',
        },
        components: {
            NextButton: null,
            PrevButton: null,
            NavigationDot: null,
            CloseButton: null,
        },
        layout: DEFAULT_LAYOUT,
    };

    state = {
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
        observer: null,
    };

    componentDidMount() {
        const { isOpen } = this.props;
        if (isOpen) {
            this.open();
        }
    }

    componentWillReceiveProps(nextProps) {
        const { isOpen, update, updateDelay } = this.props;

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

    componentWillUnmount() {
        const { isOpen } = this.props;
        if (isOpen) {
            this.close();
        }
    }

    onBeforeClose() {
        const { onBeforeClose } = this.props;
        if (onBeforeClose) {
            onBeforeClose();
        }
    }

    open() {
        const { isOpen, onAfterOpen, startAt } = this.props;
        this.setState(
            prevState => ({
                isOpen: true,
                current: startAt !== undefined ? startAt : prevState.current,
            }),
            () => {
                this.showStep();
                this.helper.focus();
                if (onAfterOpen) onAfterOpen();
            },
        );
        // TODO: debounce it.
        window.addEventListener('resize', this.showStep, false);
        window.addEventListener('keydown', this.keyDownHandler, false);
    }

    showStep = () => {
        const { steps } = this.props;
        const { current } = this.state;
        const step = steps[current];
        const node = document.querySelector(step.selector);

        const stepCallback = (o) => {
            if (step.action && typeof step.action === 'function') {
                step.action(o);
            }
        };

        if (step.observe) {
            const target = document.querySelector(step.observe);
            const config = { attributes: true, childList: true, characterData: true };
            this.setState(
                {
                    observer: new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (
                                mutation.type === 'childList' &&
                                mutation.addedNodes.length > 0
                            ) {
                                const cb = () => stepCallback(mutation.addedNodes[0]);
                                setTimeout(
                                    () =>
                                        this.calculateNode(
                                            mutation.addedNodes[0],
                                            step.position,
                                            cb,
                                        ),
                                    100,
                                );
                            } else if (
                                mutation.type === 'childList' &&
                                mutation.removedNodes.length > 0
                            ) {
                                const cb = () => stepCallback(node);
                                this.calculateNode(node, step.position, cb);
                            }
                        });
                    }),
                },
                () => this.state.observer.observe(target, config),
            );
        } else if (this.state.observer) {
            this.state.observer.disconnect();
            this.setState({
                observer: null,
            });
        }

        if (node) {
            const cb = () => stepCallback(node);
            this.calculateNode(node, step.position, cb);
        } else {
            this.setState(setNodeState(null, this.helper, step.position), stepCallback);
            console.warn(`Can't find a DOM node \`${step.selector}\`.
Please check the \`steps\` Tour prop Array at position: ${current + 1}.`);
        }
    };

    getViewportOffset = (element) => {
        let left = element.offsetLeft;
        let top = element.offsetTop;
        //let node = element;

        let node = element.parentNode;

        do {
            const styles = getComputedStyle(node);

            if (styles) {
                const position = styles.getPropertyValue('position');

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

        return { left, top };
    };

    calculateNode = (node, stepPosition, cb) => {
        const { scrollDuration, inViewThreshold, scrollOffset } = this.props;
        const attrs = hx.getNodeRect(node);
        const w = Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0,
        );
        const h = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0,
        );

        if (!hx.inView({
            ...attrs, w, h, threshold: inViewThreshold,
        })) {
            const parentScroll = Scrollparent(node);
            scrollSmooth.to(node, {
                context: hx.isBody(parentScroll) ? window : parentScroll,
                duration: scrollDuration,
                offset: scrollOffset || -(h / 2),
                callback: (nd) => {
                    this.setState(setNodeState(nd, this.helper, stepPosition), cb);
                },
            });
        } else {
            this.setState(setNodeState(node, this.helper, stepPosition), cb);
        }
    };

    close() {
        this.setState((prevState) => {
            if (prevState.observer) {
                prevState.observer.disconnect();
            }
            return {
                isOpen: false,
                observer: null,
            };
        }, this.onBeforeClose);
        window.removeEventListener('resize', this.showStep);
        window.removeEventListener('keydown', this.keyDownHandler);
    }

    maskClickHandler = (e) => {
        const { closeWithMask, onRequestClose } = this.props;
        if (closeWithMask) {
            onRequestClose(e);
        }
    };

    nextStep = () => {
        const { steps } = this.props;
        this.setState((prevState) => {
            const nextStep =
                prevState.current < steps.length - 1
                    ? prevState.current + 1
                    : prevState.current;
            return {
                current: nextStep,
            };
        }, this.showStep);
    };

    prevStep = () => {
        const { steps } = this.props;
        this.setState((prevState) => {
            const nextStep =
                prevState.current > 0 ? prevState.current - 1 : prevState.current;
            return {
                current: nextStep,
            };
        }, this.showStep);
    };

    gotoStep = (n) => {
        const { steps } = this.props;
        this.setState((prevState) => {
            const nextStep = steps[n] ? n : prevState.current;
            return {
                current: nextStep,
            };
        }, this.showStep);
    };

    keyDownHandler = (e) => {
        const { onRequestClose } = this.props;
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
            this.nextStep();
        }

        // Left arrow pressed
        if (e.keyCode === 37) {
            // left
            e.preventDefault();
            this.prevStep();
        }
    };

    render() {
        const {
            className,
            steps,
            maskName,
            helperName,
            contentName,
            controlsName,
            showButtons,
            buttonName,
            showProgress,
            showProgressNumber,
            navigationClassName,
            dotClassName,
            closeButtonClassName,
            onRequestClose,
            maskSpace,
            highlightedMaskClassName,
            disableInteraction,
            locale,
            components,
            layout,
        } = this.props;

        const {
            isOpen,
            current,
            inDOM,
            top: targetTop,
            right: targetRight,
            bottom: targetBottom,
            left: targetLeft,
            width: targetWidth,
            height: targetHeight,
            w: windowWidth,
            h: windowHeight,
            helperWidth,
            helperHeight,
            helperPosition,
        } = this.state;

        const skipButtonLabel = locale.skip || null;

        // By default the prev button calls the prevStep function
        const onPrevButtonClick = this.prevStep;
        const isPrevButtonDisabled = current === 0;
        const prevButtonLabel = locale.back || null;

        // By default the next button calls the nextStep function
        let onNextButtonClick = this.nextStep;
        const isLastStep = current === (steps.length - 1);
        if (isLastStep) {
            const noop = () => {};
            onNextButtonClick = locale.last ? onRequestClose : noop;
        }
        const isNextButtonDisabled = !locale.last && current === steps.length - 1;
        const nextButtonLabel = (locale.last && isLastStep)
            ? locale.last
            : locale.next || null;

        // Show navigation dots?
        const showNavigation = showProgress && layout === DEFAULT_LAYOUT;

        const NextButton = components.NextButton || Arrow;
        const PrevButton = components.PrevButton || Arrow;
        const NavigationDot = components.NavigationDot || Dot;
        const CloseButton = components.CloseButton || Close;

        if (isOpen) {
            return (
                <div>
                    <div
                        role="button"
                        ref={c => (this.mask = c)}
                        onClick={this.maskClickHandler}
                        className={bem.scoped(className, maskName, {
                            'is-open': isOpen,
                        })}
                    >
                        <TopMask
                            targetTop={targetTop}
                            padding={maskSpace}
                            className={maskName}
                        />
                        <RightMask
                            targetTop={targetTop}
                            targetLeft={targetLeft}
                            targetWidth={targetWidth}
                            targetHeight={targetHeight}
                            windowWidth={windowWidth}
                            padding={maskSpace}
                            className={maskName}
                        />
                        <BottomMask
                            targetHeight={targetHeight}
                            targetTop={targetTop}
                            windowHeight={windowHeight}
                            padding={maskSpace}
                            className={maskName}
                        />
                        <LeftMask
                            targetHeight={targetHeight}
                            targetTop={targetTop}
                            targetLeft={targetLeft}
                            padding={maskSpace}
                            className={maskName}
                        />
                    </div>
                    {disableInteraction && (
                        <ElementMask
                            targetTop={targetTop}
                            targetLeft={targetLeft}
                            targetWidth={targetWidth}
                            targetHeight={targetHeight}
                            padding={maskSpace}
                            className={highlightedMaskClassName}
                        />
                    )}
                    <Guide
                        innerRef={c => (this.helper = c)}
                        targetHeight={targetHeight}
                        targetWidth={targetWidth}
                        targetTop={targetTop}
                        targetRight={targetRight}
                        targetBottom={targetBottom}
                        targetLeft={targetLeft}
                        windowWidth={windowWidth}
                        windowHeight={windowHeight}
                        helperWidth={helperWidth}
                        helperHeight={helperHeight}
                        helperPosition={helperPosition}
                        padding={maskSpace}
                        tabIndex={-1}
                        current={current}
                        style={steps[current].style ? steps[current].style : {}}
                        className={bem.scoped(className, helperName, {
                            'is-open': isOpen,
                            [DEFAULT_LAYOUT]: layout === DEFAULT_LAYOUT,
                            [MINIMAL_LAYOUT]: layout === MINIMAL_LAYOUT,
                        })}
                    >
                        <div className={bem.scoped(className, contentName)}>
                            {steps[current] &&
                            (typeof steps[current].content === 'function'
                                ? steps[current].content({
                                    goTo: this.gotoStep,
                                    inDOM,
                                    step: current + 1,
                                })
                                : steps[current].content)}
                        </div>

                        <div className={bem.scoped(className, controlsName)}
                        >
                            { layout === MINIMAL_LAYOUT &&
                                <CloseButton
                                    onClick={onRequestClose}
                                    className={bem.scoped(className, buttonName, {
                                        skip: true,
                                    })}
                                >
                                    {skipButtonLabel}
                                </CloseButton> }
                            { showButtons && (
                                <PrevButton
                                    className={bem.scoped(className, buttonName, {
                                        'no-text': prevButtonLabel === null,
                                    })}
                                    onClick={onPrevButtonClick}
                                    disabled={isPrevButtonDisabled}
                                    label={prevButtonLabel}
                                />
                            ) }

                            { showNavigation && (
                                <nav className={bem.scoped(className, navigationClassName)}>
                                    {steps.map((s, i) => (
                                        <NavigationDot
                                            key={`${s.selector}_${i}`}
                                            onClick={() => this.gotoStep(i)}
                                            current={current}
                                            index={i}
                                            disabled={current === i}
                                            showNumber={showProgressNumber}
                                            className={bem.scoped(className, dotClassName)}
                                        />
                                    ))}
                                </nav>
                            ) }

                            { showButtons && (
                                <NextButton
                                    className={bem.scoped(className, buttonName, {
                                        next: true,
                                        'no-text': nextButtonLabel === null,
                                    })}
                                    onClick={onNextButtonClick}
                                    disabled={isNextButtonDisabled}
                                    inverted
                                    label={nextButtonLabel}
                                />
                            ) }
                        </div>

                        { layout === DEFAULT_LAYOUT &&
                            <CloseButton
                                onClick={onRequestClose}
                                className={bem.scoped(className, closeButtonClassName)}
                            /> }
                    </Guide>
                </div>
            );
        }

        return <div />;
    }
}

export default TourPortal;
