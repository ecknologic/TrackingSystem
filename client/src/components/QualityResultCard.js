import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import '../sass/qualityResultCard.scss';
const DATETIMEFORMAT = 'DD/MM/YYYY h:mm A'

const QualityResultCard = ({ data }) => {
    const { batchId, shiftType, levels } = data
    const level = levels[levels.length - 1]
    const { phLevel, ozoneLevel, tds, testingDate } = level
    const time = useMemo(() => dayjs(testingDate).format(DATETIMEFORMAT), [testingDate])

    return (
        <div className='quality-result-card'>
            <div className='title'>{batchId}</div>
            <div className='shift-box'>
                <span className='shift'>{shiftType} Shift</span>
                <span className='date'>{time}</span>
            </div>
            <div className='panel-details'>
                <div className='item'>
                    <span className='name'><span className='app-dot'></span>PH</span>
                    <span className='value'>{phLevel}</span>
                </div>
                <div className='item'>
                    <span className='name'><span className='app-dot'></span>Ozone level (mg/litre)</span>
                    <span className='value'>{ozoneLevel}</span>
                </div>
                <div className='item'>
                    <span className='name'><span className='app-dot'></span>TDS (mg/litre)</span>
                    <span className='value'>{tds}</span>
                </div>
            </div>
        </div>
    )
}

export default QualityResultCard