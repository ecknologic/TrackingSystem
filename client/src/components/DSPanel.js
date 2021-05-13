import React from 'react';
import CustomButton from './CustomButton';

const DSPanel = ({ onAdd }) => {

    return (
        <div className='stock-panel ds-panel-container'>
            <div className='box titles'>
                <span className='title'>Damaged Stock</span>
            </div>
            <div className='box items'>
                <span className='name'>Cans (20 ltr)</span>
                <div className='numbers-container'>
                    <span className='number'>--</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>2 Ltr Boxes (1&times;9)</span>
                <div className='numbers-container'>
                    <span className='number'>--</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>1 Ltr Boxes (1&times;12)</span>
                <div className='numbers-container'>
                    <span className='number'>--</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>500 ml Boxes (1&times;24)</span>
                <div className='numbers-container'>
                    <span className='number'>--</span>
                </div>
            </div>
            <div className='box items last'>
                <span className='name'>300 ml Boxes (1&times;30)</span>
                <div className='numbers-container'>
                    <span className='number'>--</span>
                </div>
            </div>
            <div className='buttons'>
                <CustomButton text='Get Reports' className='app-stock-btn' />
                <span className='add' onClick={onAdd}>Add Damaged Stock</span>
            </div>
        </div>
    )
}

export default DSPanel