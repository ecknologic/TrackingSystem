import React, { useState } from 'react';
import dayjs from 'dayjs';
import DatePicker from './DatePicker';
import { setTrackForm } from '../utils/Functions';

const CustomDateInput = (props) => {

    const { disabled, value, placeholder, track, onChange, format = 'DD/MM/YYYY',
        disabledDate, open, onOpenChange, style, className } = props

    const [hasTracked, setHasTracked] = useState(false)

    const handleChange = (value) => {
        onChange(value)

        if (track && !hasTracked) {
            setTrackForm()
            setHasTracked(true)
        }
    }

    return (
        <DatePicker
            open={open}
            size='large'
            style={style}
            format={format}
            disabled={disabled}
            className={className}
            onChange={handleChange}
            placeholder={placeholder}
            disabledDate={disabledDate}
            onOpenChange={onOpenChange}
            value={value ? dayjs(value) : ''}
            getPopupContainer={triggerNode => triggerNode.parentNode}
        />
    )
}

export default CustomDateInput