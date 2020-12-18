import React, { useEffect } from 'react';
import CustomButton from './CustomButton';

const CASPanel = ({ data, newStockDetails }) => {
    console.log("DBDHBHD", newStockDetails)
    const { total20LCans: newStock20L = 0, total1LBoxes: newStock1L = 0, total500MLBoxes: newStock500ML = 0, total250MLBoxes: newStock250ML = 0 } = newStockDetails
    const { total1LBoxes, total20LCans, total250MLBoxes, total500MLBoxes } = data
    return (
        <div className='stock-panel cas-panel-container'>
            <div className='box titles'>
                <span className='title'>Current Active Stock</span>
                <span className='title new'>New Arrived Stock</span>
            </div>
            <div className='box items'>
                <span className='name'>Total Cans (20 ltr)</span>
                <div className='numbers-container'>
                    <span className='number'>{total20LCans || '--'}</span>
                    <span className='number new'>{newStock20L}</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>Total 1 Ltr Boxes (1x12)</span>
                <div className='numbers-container'>
                    <span className='number'>{total1LBoxes || '--'}</span>
                    <span className='number new'>{newStock1L}</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>Total 500 ml Boxes (1x12)</span>
                <div className='numbers-container'>
                    <span className='number'>{total500MLBoxes || '--'}</span>
                    <span className='number new'>{newStock500ML}</span>
                </div>
            </div>
            <div className='box items last'>
                <span className='name'>Total 250 ml Boxes (1x12)</span>
                <div className='numbers-container'>
                    <span className='number'>{total250MLBoxes || '--'}</span>
                    <span className='number new'>{newStock250ML}</span>
                </div>
            </div>
            <div className='buttons'>
                <CustomButton text='Get Reports' className='app-stock-btn' />
            </div>
        </div>
    )
}

export default CASPanel