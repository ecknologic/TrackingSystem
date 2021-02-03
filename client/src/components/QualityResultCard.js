import React from 'react';
import '../sass/qualityResultCard.scss';

const QualityResultCard = ({ batchNo, shift }) => {

    return (
        <div className='quality-result-card'>
            <div className='title'>{batchNo}</div>
            <div className='shift-box'>
                <span className='shift'>{shift} Shift</span>
                <span className='date'>21/01/2021 2:45 PM</span>
            </div>
            <div className='details'>
                <div className='item'>

                    <span className='name'>PH</span>
                    <span className='value'>6.5 to 8.5</span>
                </div>
                <div className='item'>
                    <span className='name'>Ozone level (mg/litre)</span>
                    <span className='value'>6.5 to 8.5</span>
                </div>
                <div className='item'>
                    <span className='name'>TDS (mg/litre)</span>
                    <span className='value'>6.5 to 8.5</span>
                </div>
            </div>
        </div>
    )
}

export default QualityResultCard