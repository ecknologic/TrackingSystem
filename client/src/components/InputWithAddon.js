import { Input } from 'antd';
import React from 'react';

const InputWithAddon = ({ label, placeholder, onChange, onBlur, value, disabled, maxLength, error = '' }) => {
    return (
        <Input
            className={`input-has-addon ${error && 'app-input-addon-error'}`}
            size='large'
            maxLength={maxLength}
            placeholder={placeholder}
            addonAfter={<AddOnBtn label={label} />}
            onChange={onChange}
            value={value}
            disabled={disabled}
            onPaste={onChange}
            onBlur={onBlur}
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