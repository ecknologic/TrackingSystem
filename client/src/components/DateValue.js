import dayjs from 'dayjs';
import React from 'react';
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DateValue = ({ date }) => {

    const monthIndex = dayjs(date).month()
    const day = dayjs(date).get('date')

    return <span className='app-date-value'>{`${months[monthIndex]} - ${day}`}</span>
}

export default DateValue