import dayjs from 'dayjs';
import Slider from 'react-slick';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { LeftChevronIconGrey, RightChevronIconGrey } from './SVG_Icons';
import DaySlideItem from './DaySlideItem';
import { TODAYDATE } from '../utils/constants';
import CustomDateInput from './CustomDateInput';
import { getAdjustedSlideIndex } from '../utils/Functions';
import '../sass/daySlider.scss'
const APIDATEFORMAT = 'YYYY-MM-DD';
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DaySlider = ({ onChange }) => {
    const sliderRef = useRef()
    const [open, setOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [selectedDay, setSelectedDay] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState(0)
    const [selectedYear, setSelectedYear] = useState(0)
    const [slides, setSlides] = useState([])

    const hasSlides = slides.length

    useEffect(() => {
        if (hasSlides) {
            const actualIndex = slides.findIndex((item) => item.date == selectedDay)
            const adjustedIndex = getAdjustedSlideIndex(actualIndex, 1)
            sliderRef.current.slickGoTo(adjustedIndex)
        }
    }, [slides.length, selectedDate])


    useEffect(() => {
        const today = dayjs().format(APIDATEFORMAT)
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

        setSelectedDate(date)
        setSlides(slides)
        setSelectedDay(day)
        setSelectedMonth(month)
        setSelectedYear(year)
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        const date = dayjs(value).format(APIDATEFORMAT)

        generateRequiredDates(date)
        setOpen(false)
    }

    const beforeChange = (prev, next) => {
        const current = next + 1
        if (selectedDay != current) {
            const currentDate = `${selectedYear}-${selectedMonth}-${current}`
            onChange(currentDate)
        }
        else onChange(selectedDate)
    }

    const props = {
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <LeftChevronIconGrey />,
        nextArrow: <RightChevronIconGrey />,
        beforeChange
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
                        onSelect={() => setOpen(true)}
                    />)
                }
            </Slider>
            <CustomDateInput // Hidden in the DOM
                open={open}
                value={selectedDate}
                style={{ right: '20%' }}
                className='app-date-panel-picker'
                onChange={handleDateSelect}
                onOpenChange={datePickerStatus}
            />
        </Fragment>
    )
}

export default DaySlider