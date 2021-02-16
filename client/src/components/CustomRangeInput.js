import React, { useState } from 'react';
import DatePicker from './DatePicker';
import { ScheduleIconGrey } from './SVG_Icons';
import { setTrackForm } from '../utils/Functions';

const CustomRangeInput = (props) => {

    const { disabled, allowClear, value, placeholder = 'Select Date', track, onChange, error, format = 'DD/MM/YYYY',
        disabledDate, open, onOpenChange, style, className, suffixIcon = <ScheduleIconGrey /> } = props

    const [hasTracked, setHasTracked] = useState(false)

    const handleChange = (value) => {
        onChange(value)

        if (track && !hasTracked) {
            setTrackForm()
            setHasTracked(true)
        }
    }

    return (
        <RangePicker
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
            value={value}
            allowClear={allowClear}
            className={`${className} ${error && 'app-input-error'}`}
            getPopupContainer={node => node.parentNode}
        />
    )
}

const { RangePicker } = DatePicker
export default CustomRangeInput