import React, { useState } from 'react';
import { Select } from 'antd';

const SelectInput = ({ options, mode }) => {

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
        >
            {options}
        </Select>
    )

}

export default SelectInput