import React from 'react';
import CustomButton from './CustomButton';

const CASPanel = ({ data, newStock, onConfirm, arrivedStock, btnDisabled }) => {

    const { total1LBoxes, total20LCans, total2LBoxes, total300MLBoxes, total500MLBoxes } = data
    const { total20LCans: newStock20L, total1LBoxes: newStock1L, total2LBoxes: newStock2L, total500MLBoxes: newStock500ML,
        total300MLBoxes: newStock300ML, damaged20LCans, damaged1LBoxes, damaged2LBoxes, damaged300MLBoxes, damaged500MLBoxes } = newStock

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
                <span className='name'>Cans (20 ltr)</span>
                <div className='numbers-container'>
                    <span className='number'>{total20LCans || '--'}</span>
                    <span className='number new' style={style}>{newStock20L || '--'}</span>
                </div>
                <span className='damaged' style={style}>{damaged20LCans ? `Damaged - ${damaged20LCans}` : ''}</span>
            </div>
            <div className='box items'>
                <span className='name'>2 Ltr Boxes (1&times;9)</span>
                <div className='numbers-container'>
                    <span className='number'>{total2LBoxes || '--'}</span>
                    <span className='number new' style={style}>{newStock2L || '--'}</span>
                </div>
                <span className='damaged' style={style}>{damaged2LBoxes ? `Damaged - ${damaged2LBoxes}` : ''}</span>
            </div>
            <div className='box items'>
                <span className='name'>1 Ltr Boxes (1&times;12)</span>
                <div className='numbers-container'>
                    <span className='number'>{total1LBoxes || '--'}</span>
                    <span className='number new' style={style}>{newStock1L || '--'}</span>
                </div>
                <span className='damaged' style={style}>{damaged1LBoxes ? `Damaged - ${damaged1LBoxes}` : ''}</span>
            </div>
            <div className='box items'>
                <span className='name'>500 ml Boxes (1&times;24)</span>
                <div className='numbers-container'>
                    <span className='number'>{total500MLBoxes || '--'}</span>
                    <span className='number new' style={style}>{newStock500ML || '--'}</span>
                </div>
                <span className='damaged' style={style}>{damaged500MLBoxes ? `Damaged - ${damaged500MLBoxes}` : ''}</span>
            </div>
            <div className='box items last'>
                <span className='name'>300 ml Boxes (1&times;30)</span>
                <div className='numbers-container'>
                    <span className='number'>{total300MLBoxes || '--'}</span>
                    <span className='number new' style={style}>{newStock300ML || '--'}</span>
                </div>
                <span className='damaged' style={style}>{damaged300MLBoxes ? `Damaged - ${damaged300MLBoxes}` : ''}</span>
            </div>
            <div className='buttons'>
                {
                    showPurple ? <CustomButton text='Confirm Stock Particulars' onClick={onConfirm} className='app-stock-btn purple-btn' disabled={btnDisabled} />
                        : showGreen ? <CustomButton text='Confirmed' className='app-stock-btn green-btn' />
                            : null
                }
                <CustomButton text='Get Reports' className='app-stock-btn' />
            </div>
        </div>
    )
}

export default CASPanel