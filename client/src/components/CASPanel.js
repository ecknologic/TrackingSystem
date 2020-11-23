import React from 'react';
import CustomButton from './CustomButton';

const CASPanel = () => {

    return (
        <div className='stock-panel cas-panel-container'>
            <div className='box titles'>
                <span className='title'>Current Active Stock</span>
                <span className='title new'>New Arrived Stock</span>
            </div>
            <div className='box items'>
                <span className='name'>Total Cans (20 ltr)</span>
                <div className='numbers-container'>
                    <span className='number'>845</span>
                    <span className='number new'>480</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>Total 1 Ltr Boxes (1x12)</span>
                <div className='numbers-container'>
                    <span className='number'>845</span>
                    <span className='number new'>480</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>Total 500 ml Boxes (1x12)</span>
                <div className='numbers-container'>
                    <span className='number'>845</span>
                    <span className='number new'>480</span>
                </div>
            </div>
            <div className='box items last'>
                <span className='name'>Total 250 ml Boxes (1x12)</span>
                <div className='numbers-container'>
                    <span className='number'>845</span>
                    <span className='number new'>480</span>
                </div>
            </div>
            <div className='buttons'>
                <CustomButton text='Get Reports' className='app-stock-btn' />
            </div>
        </div>
    )
}

export default CASPanel