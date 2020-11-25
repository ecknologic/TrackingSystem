import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import React, { Fragment, useEffect, useState } from 'react';
import DateSlider from './DateSlider';
import { ScheduleIcon } from './SVG_Icons';
import '../sass/datePickerPanel.scss'

const format = 'YYYY-MM-DD';
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const DatePickerPanel = ({ onChange }) => {
    const [open, setOpen] = useState(false)
    const [weekText, setWeekText] = useState('')
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
                <div className='month-week'>
                    {`${months[selectedMonth - 1]} - ${weekText}`}
                </div>
                <DateSlider
                    data={slides}
                    selected={selectedDay}
                    onSelect={handleSlideSelect}
                    onWeekText={(text) => setWeekText(text)}
                />
                <div className='date-picker' onClick={() => setOpen(true)}>
                    <ScheduleIcon />
                    <span>Select Date</span>
                </div>
            </div>
            <DatePicker // Hidden in the DOM
                open={open}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                placeholder='Select Date'
                onOpenChange={datePickerStatus}
                onChange={handleDateSelect}
                className='date-panel-picker'
            />
        </Fragment>
    )
}

export default DatePickerPanel