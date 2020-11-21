import { Input } from 'antd';
import React from 'react';

const InputWithAddon = ({ label, placeholder, onChange, onBlur, uppercase, value, disabled, maxLength, error = '' }) => {

    const handleChange = (value) => {
        if (uppercase) onChange(value.toUpperCase())
        else onChange(value)

    }
    const handleBlur = (value) => {
        if (uppercase) onBlur(value.toUpperCase())
        else onBlur(value)

    }

    return (
        <Input
            className={`input-has-addon ${error && 'app-input-addon-error'}`}
            size='large'
            maxLength={maxLength}
            placeholder={placeholder}
            addonAfter={<AddOnBtn label={label} />}
            value={value}
            disabled={disabled}
            onPaste={({ target: { value } }) => handleChange(value)}
            onBlur={({ target: { value } }) => handleBlur(value)}
            onChange={({ target: { value } }) => handleChange(value)}
        />
    )
}

const AddOnBtn = ({ label }) => {
    return (
        <div className='app-input-addon-button'>
            <span>{label}</span>
        </div>
    )
}
export default InputWithAddon