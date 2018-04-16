import React from 'react';
import PropTypes from 'prop-types';

const Close = ({ className, onClick }) => (
    <button className={className} onClick={onClick}>
        <svg width="100%" viewBox="0 0 9.1 9.1">
            <path
                fill="currentColor"
                d="M5.9 4.5l2.8-2.8c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L4.5 3.1 1.7.3C1.3-.1.7-.1.3.3c-.4.4-.4 1 0 1.4l2.8 2.8L.3 7.4c-.4.4-.4 1 0 1.4.2.2.4.3.7.3s.5-.1.7-.3L4.5 6l2.8 2.8c.3.2.5.3.8.3s.5-.1.7-.3c.4-.4.4-1 0-1.4L5.9 4.5z"
            />
        </svg>
    </button>
);

Close.propTypes = {
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default Close;
