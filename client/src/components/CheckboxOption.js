import React from 'react';
import { Checkbox } from 'antd';

const CheckboxOption = ({ value, option, onSelect, onDeselect, checked = false }) => {

    const onChange = () => {
        !checked && onSelect(value)
        checked && onDeselect(value)
    }

    return (
        <Checkbox
            onChange={onChange}
            indeterminate={checked}
            checked={false}
            className='app-checkbox-option'
        >
            {option}
        </Checkbox>
    )
}

export default CheckboxOption