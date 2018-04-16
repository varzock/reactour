'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  transform: ', ';\n'], ['\n  transform: ', ';\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _helpers = require('../helpers');

var hx = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/**
 * Only use styled component on transformations.
 * Handle rest of the styles as normal classes.
 */
var Guide = _styledComponents2.default.div(_templateObject, function (props) {
    var targetTop = props.targetTop,
        targetRight = props.targetRight,
        targetBottom = props.targetBottom,
        targetLeft = props.targetLeft,
        targetWidth = props.targetWidth,
        targetHeight = props.targetHeight,
        windowWidth = props.windowWidth,
        windowHeight = props.windowHeight,
        helperWidth = props.helperWidth,
        helperHeight = props.helperHeight,
        helperPosition = props.helperPosition,
        padding = props.padding;


    var available = {
        left: targetLeft,
        right: windowWidth - targetRight,
        top: targetTop,
        bottom: windowHeight - targetBottom
    };

    var couldPositionAt = function couldPositionAt(position) {
        return available[position] > (hx.isHoriz(position) ? helperWidth + padding * 2 : helperHeight + padding * 2);
    };

    var autoPosition = function autoPosition(coords) {
        var positionsOrder = hx.bestPositionOf(available);
        for (var j = 0; j < positionsOrder.length; j++) {
            if (couldPositionAt(positionsOrder[j])) {
                return coords[positionsOrder[j]];
            }
        }
        return coords.center;
    };

    var pos = function pos(helperPosition) {
        var outsideY = targetTop + helperHeight > windowHeight;
        var hX = hx.isOutsideX(targetLeft + helperWidth, windowWidth) ? hx.isOutsideX(targetRight + padding, windowWidth) ? targetRight - helperWidth : targetRight - helperWidth + padding : targetLeft - padding;
        var hY = hx.isOutsideY(targetTop + helperHeight, windowHeight) ? hx.isOutsideY(targetBottom + padding, windowHeight) ? targetBottom - helperHeight : targetBottom - helperHeight + padding : targetTop - padding;
        var coords = {
            top: [hX, targetTop - helperHeight - padding * 2],
            right: [targetRight + padding * 2, hY],
            bottom: [hX, targetBottom + padding * 2],
            left: [targetLeft - helperWidth - padding * 2, hY],
            center: [windowWidth / 2 - helperWidth / 2, windowHeight / 2 - helperHeight / 2]
        };
        if (helperPosition === 'center' || couldPositionAt(helperPosition)) {
            return coords[helperPosition];
        }
        return autoPosition(coords);
    };

    var p = pos(helperPosition);

    return 'translate(' + p[0] + 'px, ' + p[1] + 'px)';
});

exports.default = Guide;