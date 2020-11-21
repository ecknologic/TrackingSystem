import React from 'react';
import CustomButton from './CustomButton';

const DCPanel = () => {

    return (
        <div className='stock-panel dc-panel-container'>
            <div className='box titles'>
                <span className='title'>Damaged Claims</span>
            </div>
            <div className='box items'>
                <span className='name'>Total Cans (20 ltr)</span>
                <div className='numbers-container'>
                    <span className='number'>367</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>Total 1 Ltr Boxes (1x12)</span>
                <div className='numbers-container'>
                    <span className='number'>845</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>Total 500 ml Boxes (1x12)</span>
                <div className='numbers-container'>
                    <span className='number'>845</span>
                </div>
            </div>
            <div className='box items last'>
                <span className='name'>Total 250 ml Boxes (1x12)</span>
                <div className='numbers-container'>
                    <span className='number'>845</span>
                </div>
            </div>
            <div className='buttons'>
                <CustomButton text='View Details' className='app-stock-btn' />
                <CustomButton text='Get Reports' className='app-stock-btn' />
            </div>
        </div>
    )
}

export default DCPanel