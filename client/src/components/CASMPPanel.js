import React from 'react';

const CASMPPanel = ({ data }) => {
    const { total1LBoxes, total20LCans, total250MLBoxes, total500MLBoxes } = data

    return (
        <div className='stock-panel casmp-panel-container'>
            <div className='box titles'>
                <span className='title'>Current Active Stock</span>
            </div>
            <div className='box items'>
                <span className='name'>20 ltrs</span>
                <div className='numbers-container'>
                    <span className='number'>{total1LBoxes || '--'}</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>1 Ltrs</span>
                <div className='numbers-container'>
                    <span className='number'>{total20LCans || '--'}</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>500 Ml</span>
                <div className='numbers-container'>
                    <span className='number'>{total250MLBoxes || '--'}</span>
                </div>
            </div>
            <div className='box items last'>
                <span className='name'>250 Ml</span>
                <div className='numbers-container'>
                    <span className='number'>{total500MLBoxes || '--'}</span>
                </div>
            </div>
        </div>
    )
}

export default CASMPPanel