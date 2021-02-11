import React from 'react';

const PanelStats = ({ title, data }) => {
    const { product20LCount, product2LCount, product1LCount, product500MLCount, product250MLCount } = data

    return (
        <div className='panel-stats'>
            <span className='title'>{title}</span>
            <div className='details'>
                <div className='item'>
                    <span className='name'><span className='app-dot' style={{ background: '#8C54FF  ' }}></span>20 Ltrs</span>
                    <span className='item-number'>{product20LCount || 0}</span>
                </div>
                <div className='item'>
                    <span className='name'><span className='app-dot' style={{ background: '#2EB3FF' }}></span>2 Ltrs</span>
                    <span className='item-number'>{product2LCount || 0}</span>
                </div>
                <div className='item'>
                    <span className='name'><span className='app-dot' style={{ background: '#F7B500' }}></span>1 Ltrs</span>
                    <span className='item-number'>{product1LCount || 0}</span>
                </div>
                <div className='item'>
                    <span className='name'><span className='app-dot' style={{ background: '#33CBCC' }}></span>500 ml</span>
                    <span className='item-number'>{product500MLCount || 0}</span>
                </div>
                <div className='item'>
                    <span className='name'><span className='app-dot' style={{ background: '#62BE9D' }}></span>300 ml</span>
                    <span className='item-number'>{product250MLCount || 0}</span>
                </div>
            </div>
        </div>
    )

}

export default PanelStats