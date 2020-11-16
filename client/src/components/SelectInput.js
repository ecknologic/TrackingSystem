import React, { useState } from 'react';
import { Select, Tag } from 'antd';
import { DDownIcon } from './SVG_Icons';
import { setTrackForm } from '../utils/Functions';

const SelectInput = ({ options, mode, onSelect, onDeselect, value, disabled, track }) => {
    const [hasTracked, setHasTracked] = useState(false)

    const handleSelect = (value) => {
        onSelect(value)

        if (track && !hasTracked) {
            setTrackForm()
            setHasTracked(true)
        }
    }

    const tagRender = (props) => {
        const { label, closable, onClose } = props;

        return (
            <Tag color='#0091FF' closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                {label}
            </Tag>
        );
    }

    return (
        <Select
            value={value}
            mode={mode}
            size='large'
            placeholder='Select'
            tagRender={tagRender}
            onSelect={handleSelect}
            onDeselect={onDeselect}
            disabled={disabled}
            maxTagCount={4}
            showArrow
            suffixIcon={<DDownIcon />}
            getPopupContainer={triggerNode => triggerNode.parentNode}
        >
            {options}
        </Select>
    )

}

export default SelectInput