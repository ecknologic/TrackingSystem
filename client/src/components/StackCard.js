import React from 'react';
import '../sass/stackCard.scss';

const StackCard = ({ title, total, }) => {


    return (
        <div className='stack-card'>
            <div className='image-box'>Image</div>
            <div className='body'>
                <div className='title'>{title}</div>
                <div className='number'>{total}</div>
            </div>
        </div>
    )
}

export default StackCard