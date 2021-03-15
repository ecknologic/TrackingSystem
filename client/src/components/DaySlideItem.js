import React from 'react';
import { MONTHSFULL } from '../assets/fixtures';

const DaySlideItem = ({ item, selected, year, month, onSelect, todaysDay }) => {
    const { day, date } = item
    console.log('selected', selected)
    return (
        <div
            className='app-day-slide-item'
            onClick={() => onSelect(date)}
        >
            <span className='date'>{`${MONTHSFULL[month - 1]} ${date}`}</span>
        </div>
    )
}

export default DaySlideItem