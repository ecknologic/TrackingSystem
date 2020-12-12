import React from 'react';

const DateSlideItem = ({ item, selected, disable, onSelect, todaysDay }) => {
    const { day, date } = item
    const classnames = `${selected == date ? 'selected' : ''} ${date > todaysDay && disable ? 'disabled' : ''}`

    return (
        <div
            className={`app-date-slide-item ${classnames}`}
            onClick={() => onSelect(date)}
        >
            <span className='date'>{date}</span>
            <span className='day'>{day}</span>
        </div>
    )
}

export default DateSlideItem