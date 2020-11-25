import React, { useEffect, useRef, useState } from 'react';
import Slider from "react-slick";
import DateSlideItem from './DateSlideItem';
import { RightChevronIconGrey, LeftChevronIconGrey } from './SVG_Icons';
import { getAdjustedSlideIndex } from '../utils/Functions';
import WeekSlider from './WeekSlider';
import '../sass/dateSlider.scss'

const DateSlider = ({ data, selected, month, onSelect }) => {
    const sliderRef = useRef()
    const [slidesToShow, setSlidesToShow] = useState(9)
    const [weekStart, setWeekStart] = useState('')
    const [weekEnd, setWeekEnd] = useState('')
    const hasSlides = data.length

    useEffect(() => {
        if (hasSlides) {
            const item = data.find((item) => item.date == selected)
            const actualIndex = data.indexOf(item)
            const adjustedIndex = getAdjustedSlideIndex(actualIndex, slidesToShow)
            sliderRef.current.slickGoTo(adjustedIndex)
        }
    }, [selected])

    const beforeChange = (prev, next) => {
        setWeekStart(next + 1)
        setWeekEnd(next + slidesToShow)
    }

    const props = {
        infinite: false,
        slidesToShow: 9,
        slidesToScroll: 7,
        prevArrow: <LeftChevronIconGrey />,
        nextArrow: <RightChevronIconGrey />,
        beforeChange
    };

    return (
        <>
            <WeekSlider
                month={month - 1}
                start={weekStart}
                end={weekEnd}
                onClick={() => { }}
            />
            <Slider className='date-slider' {...props} ref={sliderRef}>
                {
                    data.map((item) => (
                        <DateSlideItem
                            item={item}
                            selected={selected}
                            onSelect={onSelect}
                        />
                    ))
                }
            </Slider>
        </>
    )
}

export default DateSlider