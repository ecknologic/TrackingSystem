import dayjs from 'dayjs';
import React from 'react';
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DateValue = ({ date, to }) => {

    const fromMonthIndex = dayjs(date).month()
    const fromDay = dayjs(date).get('date')
    const toMonthIndex = dayjs(to).month()
    const toDay = dayjs(to).get('date')

    const isSame = dayjs(date).isSame(dayjs(to))

    const FromEl = <span className='app-date-value'>{`${months[fromMonthIndex]} - ${fromDay}`}</span>
    const ToEl = <span className='app-date-value'>{`${months[toMonthIndex]} - ${toDay}`}</span>

    if (to && !isSame) return (
        <>
            {FromEl} <span className='app-date-value middle'>to</span> {ToEl}
        </>
    )

    return FromEl
}

export default DateValue