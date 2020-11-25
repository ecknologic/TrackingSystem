import React from 'react';

const DateSlideItem = ({ item, selected, onSelect }) => {
    const { day, date } = item

    return (
        <div
            className={`app-date-slide-item ${selected == date ? 'selected' : ''}`}
            onClick={() => onSelect(date)}
        >
            <span className='date'>{date}</span>
            <span className='day'>{day}</span>
        </div>
    )
}

export default DateSlideItem