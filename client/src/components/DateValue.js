import dayjs from 'dayjs';
import React from 'react';
import { MONTHS } from '../assets/fixtures';

const DateValue = ({ date, to }) => {
    const fromMonthIndex = dayjs(date).month()
    const fromDay = dayjs(date).get('date')
    const toMonthIndex = dayjs(to).month()
    const toDay = dayjs(to).get('date')

    const isSame = dayjs(date).isSame(dayjs(to))

    const FromEl = <span className='app-date-value'>{`${MONTHS[fromMonthIndex]} - ${fromDay}`}</span>
    const ToEl = <span className='app-date-value'>{`${MONTHS[toMonthIndex]} - ${toDay}`}</span>

    if (to && !isSame) return (
        <>
            {FromEl} <span className='app-date-value middle'>to</span> {ToEl}
        </>
    )

    return FromEl
}

export default DateValue