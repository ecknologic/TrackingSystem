import React from 'react';
import CustomButton from './CustomButton';

const ECPanel = ({ confirmed, returned, onAdd }) => {
    const { emptycans: cec } = confirmed
    const { emptycans: rec } = returned
    return (
        <div className='stock-panel ec-panel-container'>
            <div className='box titles'>
                <span className='title'>Empty Cans</span>
            </div>
            <div className='box items'>
                <span className='name'>Total Cans (20 ltr)</span>
                <div className='numbers-container'>
                    <span className='number'>{cec}</span>
                </div>
            </div>
            <div className='box items mother-plant'>
                <span className='name'>Return to Mother Plant</span>
                <div className='return'>
                    {
                        rec ? (
                            <div className='numbers-container'>
                                <span className='number'>{rec}</span>
                            </div>
                        ) : null
                    }
                    <span className='add' onClick={onAdd}>Add Empty Cans</span>
                </div>
            </div>
            <div className='buttons'>
                <CustomButton text='Get Reports' className='app-stock-btn' />
            </div>
        </div>
    )
}

export default ECPanel