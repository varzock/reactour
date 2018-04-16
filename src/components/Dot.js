import React from 'react';
import PropTypes from 'prop-types';
import bem from '@dr/bem-helper';

const Dot = (props) => {
    const {
        disabled,
        onClick,
        current,
        index,
        showNumber,
        className,
    } = props;

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={bem.scoped(className, {
                'is-current': current === index,
                'show-number': showNumber,
            })}
        />
    );
};

Dot.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    current: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    showNumber: PropTypes.bool.isRequired,
    className: PropTypes.string.isRequired,
};

export default Dot;
