import React from 'react';
import { Input } from 'antd';

const CustomInput = ({ disabled, maxLength, type, value, placeholder, uppercase, error = '', onChange, onBlur }) => {

    const handleChange = (value) => {
        if (uppercase) onChange(value.toUpperCase())
        else onChange(value)

    }
    const handleBlur = (value) => {
        if (onBlur) {
            if (uppercase) onBlur(value.toUpperCase())
            else onBlur(value)
        }
    }

    return (
        <Input
            size='large'
            type={type}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            placeholder={placeholder}
            className={error && 'app-input-error'}
            onBlur={({ target: { value } }) => handleBlur(value)}
            onChange={({ target: { value } }) => handleChange(value)}
            autoComplete='none'
        />
    )
}

export default CustomInput