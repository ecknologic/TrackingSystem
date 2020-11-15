import React from 'react';
import { Select } from 'antd';
import { DDownIcon } from './SVG_Icons';
import { onTrackForm } from '../utils/Functions';

const SelectInput = ({ options, mode, onSelect, onDeselect, value, disabled }) => {

    const handleSelect = (value) => {
        onSelect(value)
        onTrackForm()
    }

    return (
        <Select
            getPopupContainer={triggerNode => triggerNode.parentNode}
            size='large'
            value={value}
            placeholder='Select'
            mode={mode}
            onSelect={handleSelect}
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