import React, { useState } from 'react';
import { Select, Tag } from 'antd';
import { DDownIcon } from './SVG_Icons';
import { setTrackForm } from '../utils/Functions';

const SelectInput = ({ options, mode, onSelect, onDeselect, value, disabled, showSearch,
    placeholder = 'Select', track, error = '', className, suffixIcon = <DDownIcon />, ref }) => {
    const [hasTracked, setHasTracked] = useState(false)

    const handleSelect = (value, { props: { children } }) => {
        onSelect(value, children)

        if (track && !hasTracked) {
            setTrackForm()
            setHasTracked(true)
        }
    }

    const handleDeselect = (value) => {
        onDeselect(value)

        if (track && !hasTracked) {
            setTrackForm()
            setHasTracked(true)
        }
    }

    const tagRender = (props) => {
        const { label, value, closable, onClose } = props;

        if (label === 'ALL') return null
        return (
            <Tag color='#0062FF' key={value} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                {label}
            </Tag>
        );
    }

    const showScroll = options.length > 8

    return (
        <Select
            ref={ref}
            showArrow
            mode={mode}
            size='large'
            value={value}
            maxTagCount={4}
            showSearch={showSearch}
            disabled={disabled}
            tagRender={tagRender}
            suffixIcon={suffixIcon}
            onClear={handleSelect}
            onSelect={handleSelect}
            placeholder={placeholder}
            onDeselect={handleDeselect}
            allowClear={mode !== 'multiple'}
            filterOption={(input, option) => String(option.props.children).toLowerCase().indexOf(input.toLowerCase()) >= 0}
            dropdownClassName={showScroll && 'select-dropdown-overflow'}
            className={`${className} ${error && 'app-select-error'}`}
            getPopupContainer={node => node.parentNode}
        >
            {options}
        </Select>
    )

}

export default SelectInput