import React from 'react';

const CASMPPanel = ({ data }) => {
    const { product20LCount, product2LCount, product1LCount, product500MLCount, product300MLCount } = data

    return (
        <div className='stock-panel casmp-panel-container'>
            <div className='box titles'>
                <span className='title'>Current Active Stock</span>
            </div>
            <div className='box items'>
                <span className='name'>20 ltrs</span>
                <div className='numbers-container'>
                    <span className='number'>{product20LCount || '--'}</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>2 Ltrs</span>
                <div className='numbers-container'>
                    <span className='number'>{product2LCount || '--'}</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>1 Ltrs</span>
                <div className='numbers-container'>
                    <span className='number'>{product1LCount || '--'}</span>
                </div>
            </div>
            <div className='box items'>
                <span className='name'>500 Ml</span>
                <div className='numbers-container'>
                    <span className='number'>{product500MLCount || '--'}</span>
                </div>
            </div>
            <div className='box items last'>
                <span className='name'>300 Ml</span>
                <div className='numbers-container'>
                    <span className='number'>{product300MLCount || '--'}</span>
                </div>
            </div>
        </div>
    )
}

export default CASMPPanel