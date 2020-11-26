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
            const adjustedIndex = getAdjustedSlideIndex(actualIndex, getSlidesToShow())
            sliderRef.current.slickGoTo(adjustedIndex)
        }
    }, [selected])

    useEffect(() => {
        setSlidesToShow(getSlidesToShow())
    }, [])

    const beforeChange = (prev, next) => {
        setWeekStart(next + 1)
        setWeekEnd(next + slidesToShow)
    }

    const props = {
        infinite: false,
        slidesToShow,
        slidesToScroll: 7,
        prevArrow: <LeftChevronIconGrey />,
        nextArrow: <RightChevronIconGrey />,
        beforeChange,
        responsive: getResponsive()
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
                            key={item.date}
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

const getSlidesToShow = () => {
    if (window.innerWidth >= 1360) return 10;
    else if (window.innerWidth >= 1270) return 9;
    else if (window.innerWidth >= 1200) return 8;
    else if (window.innerWidth >= 1120) return 7;
    else if (window.innerWidth >= 1050) return 6;
    else if (window.innerWidth < 1050) return 5;
}
const getResponsive = () => {
    return [
        {
            breakpoint: 1360,
            settings: {
                slidesToShow: 9
            }
        },
        {
            breakpoint: 1270,
            settings: {
                slidesToShow: 8
            }
        },
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 7,
            }
        },
        {
            breakpoint: 1120,
            settings: {
                slidesToShow: 6,
                slidesToScroll: 6
            }
        },
        {
            breakpoint: 1050,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 5
            }
        }
    ]
}

export default DateSlider