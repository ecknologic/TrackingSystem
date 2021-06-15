import dayjs from 'dayjs';
import React, { useState } from 'react';
import DatePicker from './DatePicker';
import { ScheduleIconGrey } from './SVG_Icons';
import { setTrackForm } from '../utils/Functions';

const CustomDateInput = (props) => {

    const { disabled, allowClear, value, placeholder = 'Select Date', track, onChange, error, format = 'DD/MM/YYYY',
        disabledDate, open, onOpenChange, style, className, suffixIcon = <ScheduleIconGrey />, getPopupContainer = node => node.parentNode } = props

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
            suffixIcon={suffixIcon}
            onChange={handleChange}
            placeholder={placeholder}
            disabledDate={disabledDate}
            onOpenChange={onOpenChange}
            value={value ? dayjs(value) : null}
            allowClear={allowClear}
            className={`${className} ${error && 'app-input-error'}`}
            getPopupContainer={getPopupContainer}
        />
    )
}

export default CustomDateInput