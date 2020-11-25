import React from 'react';
import '../sass/weekSlider.scss'
import { LeftChevronIconGrey, RightChevronIconGrey } from './SVG_Icons';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const WeekSlider = ({ month, start, end, onClick }) => {

    const range = `${start} to ${end}`
    return (
        <div className='week-slider'>
            <span className='nav' onClick={() => onClick('prev')}><LeftChevronIconGrey /></span>
            <span className='text'>{`${months[month]} - ${range}`}</span>
            <span className='nav' onClick={() => onClick('next')}><RightChevronIconGrey /></span>
        </div>
    )
}

export default WeekSlider