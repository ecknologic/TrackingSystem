import React from 'react';
import { MONTHSFULL } from '../assets/fixtures';

const DaySlideItem = ({ item, month, onSelect }) => {
    const { date } = item

    return (
        <div
            className='app-day-slide-item'
        >
            <span onClick={onSelect}
                className='date'>
                {`${MONTHSFULL[month - 1]} ${date}`}
            </span>
        </div>
    )
}

export default DaySlideItem