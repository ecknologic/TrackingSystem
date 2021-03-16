import dayjs from 'dayjs';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import DateSlider from './DateSlider';
import { ScheduleIcon } from './SVG_Icons';
import { disableFutureDates, resetTrackForm } from '../utils/Functions';
import { TODAYDATE, TRACKFORM } from '../utils/constants';
import ConfirmModal from '../components/CustomModal';
import ConfirmMessage from '../components/ConfirmMessage';
import CustomDateInput from '../components/CustomDateInput';
import '../sass/datePickerPanel.scss'
const format = 'YYYY-MM-DD';
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DatePickerPanel = ({ onChange, onSelect }) => {
    const [open, setOpen] = useState(false)
    const [daysInMonth, SetdaysInMonth] = useState(0)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [selectedDay, setSelectedDay] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState(0)
    const [selectedYear, setSelectedYear] = useState(0)
    const [confirm, setConfirm] = useState(false)
    const [slides, setSlides] = useState([])

    const clickRef = useRef('')

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
        setSelectedDate(date)
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
        const sameDay = selectedDate == date
        const formHasChanged = sessionStorage.getItem(TRACKFORM)

        if (formHasChanged && !sameDay) {
            clickRef.current = value
            setConfirm(true)
        }
        else {
            !sameDay && onSelect()
            generateRequiredDates(date)
            setOpen(false)
        }
    }

    const handleSlideSelect = (value) => {
        const sameDay = selectedDay == value
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !sameDay) {
            clickRef.current = value
            setConfirm(true)
        }
        else {
            !sameDay && onSelect()
            setSelectedDay(value)
            const date = `${selectedYear}-${selectedMonth}-${value}`
            setSelectedDate(date)
            onChange(date)
        }
    }

    const handleConfirmCancel = useCallback(() => setConfirm(false), [])
    const handleConfirmOk = useCallback(() => {
        setConfirm(false)
        resetTrackForm()
        const value = clickRef.current

        if (typeof value === 'number') {
            handleSlideSelect(value)
        }
        else handleDateSelect(value)
    }, [selectedDay])

    return (
        <Fragment>
            <div className='date-panel-container'>
                <DateSlider
                    data={slides}
                    selected={selectedDay}
                    month={selectedMonth}
                    selectedDate={selectedDate}
                    onSelect={handleSlideSelect}
                    daysInMonth={daysInMonth}
                />
                <div className='app-date-picker-wrapper'>
                    <div className='date-picker' onClick={() => setOpen(true)}>
                        <ScheduleIcon />
                        <span>Select Date</span>
                    </div>
                    <CustomDateInput // Hidden in the DOM
                        open={open}
                        value={selectedDate}
                        style={{ right: 0 }}
                        className='app-date-panel-picker'
                        onChange={handleDateSelect}
                        onOpenChange={datePickerStatus}
                        disabledDate={disableFutureDates}
                    />
                </div>
            </div>
            <ConfirmModal
                visible={confirm}
                onOk={handleConfirmOk}
                onCancel={handleConfirmCancel}
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </Fragment>
    )
}

export default DatePickerPanel