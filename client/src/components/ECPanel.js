import React from 'react';
import CustomButton from './CustomButton';

const ECPanel = ({ data, onAdd }) => {
    const { emptycans } = data
    return (
        <div className='stock-panel ec-panel-container'>
            <div className='box titles'>
                <span className='title'>Empty Cans</span>
            </div>
            <div className='box items'>
                <span className='name'>Total Cans (20 ltr)</span>
                <div className='numbers-container'>
                    <span className='number'>{emptycans || '--'}</span>
                </div>
            </div>
            <div className='box items mother-plant'>
                <span className='name'>Return to Mother Plant</span>
                <span className='add' onClick={onAdd}>Add Empty Cans</span>
                {/* <div className='numbers-container'>
                    <span className='number'>845</span>
                </div> */}
            </div>
            <div className='buttons'>
                <CustomButton text='Get Reports' className='app-stock-btn' />
            </div>
        </div>
    )
}

export default ECPanel