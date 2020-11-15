import React from 'react';
import { Select } from 'antd';
import { DDownIcon } from './SVG_Icons';

const SelectInput = ({ options, mode, onSelect, onDeselect, value, disabled }) => {

    return (
        <Select
            getPopupContainer={triggerNode => triggerNode.parentNode}
            size='large'
            value={value}
            placeholder='Select'
            mode={mode}
            onSelect={onSelect}
            onDeselect={onDeselect}
            disabled={disabled}
            showArrow
            suffixIcon={<DDownIcon />}
        >
            {options}
        </Select>
    )

}

export default SelectInput