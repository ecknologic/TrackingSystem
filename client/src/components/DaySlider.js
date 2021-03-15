import dayjs from 'dayjs';
import Slider from 'react-slick';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { LeftChevronIconGrey, RightChevronIconGrey } from './SVG_Icons';
import { TODAYDATE, TRACKFORM } from '../utils/constants';
import '../sass/daySlider.scss'
import DaySlideItem from './DaySlideItem';
const format = 'YYYY-MM-DD';
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DaySlider = ({ onChange, onSelect }) => {
    const sliderRef = useRef()
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

    const props = {
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <LeftChevronIconGrey />,
        nextArrow: <RightChevronIconGrey />,
        // beforeChange
    };

    return (
        <Fragment>
            <Slider className='day-slider' {...props} ref={sliderRef}>
                {
                    slides.map((item) => <DaySlideItem
                        key={item.date}
                        item={item}
                        year={selectedYear}
                        month={selectedMonth}
                        onSelect={onSelect}
                    />)
                }
            </Slider>
        </Fragment>
    )
}

export default DaySlider