import React, { useState } from 'react';
import { Checkbox } from 'antd';

const CheckboxOption = ({ value, option, onSelect, onDeselect }) => {
    const [isChecked, setIsChecked] = useState(false)

    const onChange = ({ target: { checked } }) => {
        checked && onSelect(value)
        !checked && onDeselect(value)
        setIsChecked(!isChecked)
    }

    return (
        <Checkbox
            onChange={onChange}
            indeterminate={isChecked}
            checked={false}
            className='app-checkbox-option'
        >
            {option}
        </Checkbox>
    )
}

export default CheckboxOption