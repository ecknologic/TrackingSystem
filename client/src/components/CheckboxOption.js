import React, { useState } from 'react';
import { Checkbox } from 'antd';

const CheckboxOption = ({ value, option, onSelect, onDeselect }) => {
    const [isChecked, setIsChecked] = useState(false)

    const onChange = () => {
        !isChecked && onSelect(value)
        isChecked && onDeselect(value)
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