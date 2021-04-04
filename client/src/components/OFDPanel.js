import React from 'react';
import CustomButton from './CustomButton';

const OFDPanel = ({ data }) => {
    const { total1LBoxes, total20LCans, total2LBoxes, total300MLBoxes, total500MLBoxes } = data

    return (
        <div className='stock-panel ofd-panel-container'>
            <div className='box titles'>
                <span className='title'>Out For Delivery</span>
            </div>
            <div className='box items'>
                <span className='name'>Cans (20 ltr)</span>
                <div className='numbers-container'>
                    <span className='number'>{total20LCans || '--'}</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>2 Ltr Boxes (1&times;9)</span>
                <div className='numbers-container'>
                    <span className='number'>{total2LBoxes || '--'}</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>1 Ltr Boxes (1&times;12)</span>
                <div className='numbers-container'>
                    <span className='number'>{total1LBoxes || '--'}</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>500 ml Boxes (1&times;24)</span>
                <div className='numbers-container'>
                    <span className='number'>{total500MLBoxes || '--'}</span>
                </div>
            </div>
            <div className='box items last'>
                <span className='name'>300 ml Boxes (1&times;30)</span>
                <div className='numbers-container'>
                    <span className='number'>{total300MLBoxes || '--'}</span>
                </div>
            </div>
            {/* Below items should be: uncommented  */}
            {/* <div className='buttons'>
                <CustomButton text='21 - D.C Details' className='app-stock-btn' />
                <CustomButton text='Get Reports' className='app-stock-btn' />
            </div> */}
        </div>
    )
}

export default OFDPanel