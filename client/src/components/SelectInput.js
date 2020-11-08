import React, { useState } from 'react';
import { Select } from 'antd';

const SelectInput = ({ options, mode, onSelect, onDeselect, value }) => {

    return (
        <Select
            getPopupContainer={triggerNode => triggerNode.parentNode}
            size='large'
            value={value}
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