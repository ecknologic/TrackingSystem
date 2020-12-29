import React from 'react';
import CustomButton from './CustomButton';

const CASPanel = ({ data, newStock, onConfirm, arrivedStock }) => {

    const { total1LBoxes, total20LCans, total250MLBoxes, total500MLBoxes } = data
    const { total20LCans: newStock20L, total1LBoxes: newStock1L, total500MLBoxes: newStock500ML,
        total250MLBoxes: newStock250ML, damaged20LCans, damaged1LBoxes, damaged250MLBoxes, damaged500MLBoxes } = newStock

    const isConfirmed = arrivedStock.every(item => item.isConfirmed === 1)
    const style = {
        opacity: isConfirmed ? 1 : 0.4
    }

    const isArrived = arrivedStock.length
    const showPurple = isArrived && !isConfirmed
    const showGreen = isArrived && isConfirmed

    return (
        <div className='stock-panel cas-panel-container'>
            <div className='box titles'>
                <span className='title'>Current Active Stock</span>
                <span className='title new' style={style}>New Arrived Stock</span>
            </div>
            <div className='box items'>
                <span className='name'>Total Cans (20 ltr)</span>
                <div className='numbers-container'>
                    <span className='number'>{total20LCans || '--'}</span>
                    <span className='number new' style={style}>{newStock20L || '--'}</span>
                </div>
                <span className='damaged' style={style}>{damaged20LCans ? `Damaged - ${damaged20LCans}` : ''}</span>
            </div>
            <div className='box items'>
                <span className='name'>Total 1 Ltr Boxes (1x12)</span>
                <div className='numbers-container'>
                    <span className='number'>{total1LBoxes || '--'}</span>
                    <span className='number new' style={style}>{newStock1L || '--'}</span>
                </div>
                <span className='damaged' style={style}>{damaged1LBoxes ? `Damaged - ${damaged1LBoxes}` : ''}</span>
            </div>
            <div className='box items'>
                <span className='name'>Total 500 ml Boxes (1x12)</span>
                <div className='numbers-container'>
                    <span className='number'>{total500MLBoxes || '--'}</span>
                    <span className='number new' style={style}>{newStock500ML || '--'}</span>
                </div>
                <span className='damaged' style={style}>{damaged500MLBoxes ? `Damaged - ${damaged500MLBoxes}` : ''}</span>
            </div>
            <div className='box items last'>
                <span className='name'>Total 250 ml Boxes (1x12)</span>
                <div className='numbers-container'>
                    <span className='number'>{total250MLBoxes || '--'}</span>
                    <span className='number new' style={style}>{newStock250ML || '--'}</span>
                </div>
                <span className='damaged' style={style}>{damaged250MLBoxes ? `Damaged - ${damaged250MLBoxes}` : ''}</span>
            </div>
            <div className='buttons'>
                {
                    showPurple ? <CustomButton text='Confirm Stock Particulars' onClick={onConfirm} className='app-stock-btn purple-btn' />
                        : showGreen ? <CustomButton text='Confirmed' className='app-stock-btn green-btn' />
                            : null
                }
                <CustomButton text='Get Reports' className='app-stock-btn' />
            </div>
        </div>
    )
}

export default CASPanel