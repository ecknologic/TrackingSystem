import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import DateSlider from './DateSlider';
import { ScheduleIcon } from './SVG_Icons';
import '../sass/datePickerPanel.scss'
const format = 'YYYY-MM-DD';
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DatePickerPanel = ({ onChange }) => {
    const [open, setOpen] = useState(false)
    const [daysInMonth, SetdaysInMonth] = useState(0)
    const [selectedDay, setSelectedDay] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState(0)
    const [selectedYear, setSelectedYear] = useState(0)
    const [slides, setSlides] = useState([])

    useEffect(() => {
        const today = dayjs().format(format)
        generateRequiredDates(today)
    }, [])

    const generateRequiredDates = (date) => {
        const daysInMonth = dayjs(date).daysInMonth()
        const day = dayjs(date).format('D')
        const month = dayjs(date).format('M')
        const year = dayjs(date).format('YYYY')

        const slides = [...Array(daysInMonth).keys()].map((day) => {
            const currentDate = `${year}-${month}-${day + 1}`
            return { date: day + 1, day: days[dayjs(currentDate).day()] }
        })

        onChange(date)
        setSlides(slides)
        SetdaysInMonth(daysInMonth)
        setSelectedDay(day)
        setSelectedMonth(month)
        setSelectedYear(year)
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        const date = dayjs(value).format(format)
        generateRequiredDates(date)
        setOpen(false)
    }

    const handleSlideSelect = (value) => {
        setSelectedDay(value)
        const date = `${selectedYear}-${selectedMonth}-${value}`
        onChange(date)
    }

    return (
        <Fragment>
            <div className='date-panel-container'>
                <DateSlider
                    data={slides}
                    selected={selectedDay}
                    month={selectedMonth}
                    onSelect={handleSlideSelect}
                    daysInMonth={daysInMonth}
                />
                <div className='date-picker' onClick={() => setOpen(true)}>
                    <ScheduleIcon />
                    <span>Select Date</span>
                </div>
            </div>
            <DatePicker // Hidden in the DOM
                open={open}
                placeholder='Select Date'
                className='date-panel-picker'
                onChange={handleDateSelect}
                onOpenChange={datePickerStatus}
                getPopupContainer={triggerNode => triggerNode.parentNode}
            />
        </Fragment>
    )
}

export default DatePickerPanel