import React from 'react';
import '../sass/qualityResultCard.scss';

const QualityResultCard = ({ batchNo, shift }) => {

    const items = [{
        name: 'PH',
        value: '6.5 to 8.5'
    },
    {
        name: 'Ozone level (mg/litre)',
        value: '6.5 to 8.5'
    },
    {
        name: 'TDS (mg/litre)',
        value: '6.5 to 8.5'
    }]

    return (
        <div className='quality-result-card'>
            <div className='title'>{batchNo}</div>
            <div className='shift-box'>
                <span className='shift'>{shift} Shift</span>
                <span className='date'>21/01/2021 2:45 PM</span>
            </div>
            <div className='panel-details'>
                {
                    items.map((item) => {
                        const { name, value } = item
                        return (
                            <div className='item'>
                                <span className='name'><span className='app-dot'></span>{name}</span>
                                <span className='value'>{value}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default QualityResultCard