import React from 'react';
import { Input } from 'antd';

const CustomInput = ({ disabled, maxLength, type, value, placeholder, error = '', onChange, onBlur }) => {
    return (
        <Input
            size='large'
            type={type}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            placeholder={placeholder}
            className={`app-id-input ${error && 'app-input-error'}`}
            onBlur={onBlur}
            onChange={onChange}
            autoComplete='none'
        />
    )
}

export default CustomInput