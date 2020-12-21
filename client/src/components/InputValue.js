import React from 'react';

const InputValue = ({ value, size }) => {
    return <span className={`app-input-value-${size}`}>{value}</span>
}

export default InputValue