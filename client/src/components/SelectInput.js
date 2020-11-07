import React, { useState } from 'react';
import { Select } from 'antd';

const SelectInput = ({ options, mode, onSelect, onDeselect }) => {

    const [selected, setSelected] = useState()

    const handleChange = (value) => {
        setSelected(value)
    }

    return (
        <Select
            onChange={handleChange}
            size='large'
            value={selected}
            placeholder='Select'
            mode={mode}
            onSelect={onSelect}
            onDeselect={onDeselect}
        >
            {options}
        </Select>
    )

}

export default SelectInput