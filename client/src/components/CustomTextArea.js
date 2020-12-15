import React from 'react';
import { Input } from 'antd';

const CustomTextArea = ({ disabled, maxLength, value, placeholder, error = '', onChange, minRows = 2, maxRows = 2 }) => {

    return (
        <Input.TextArea
            size='large'
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            placeholder={placeholder}
            autoSize={{ minRows, maxRows }}
            className={error && 'app-input-error'}
            onChange={({ target: { value } }) => onChange(value)}
            autoComplete='none'
        />
    )
}

export default CustomTextArea