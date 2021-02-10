import React from 'react';

const PanelStats = () => {

    return (
        <div className='panel-stats'>
            <span className='title'>Total Production</span>
            <div className='details'>
                <div className='item'>
                    <span className='name'><span className='app-dot' style={{ background: '#8C54FF  ' }}></span>20 Ltrs</span>
                    <span className='item-number'>299</span>
                </div>
                <div className='item'>
                    <span className='name'><span className='app-dot' style={{ background: '#2EB3FF' }}></span>2 Ltrs</span>
                    <span className='item-number'>299</span>
                </div>
                <div className='item'>
                    <span className='name'><span className='app-dot' style={{ background: '#8C54FF' }}></span>1 Ltrs</span>
                    <span className='item-number'>299</span>
                </div>
                <div className='item'>
                    <span className='name'><span className='app-dot' style={{ background: '#33CBCC' }}></span>500 ml</span>
                    <span className='item-number'>299</span>
                </div>
                <div className='item'>
                    <span className='name'><span className='app-dot' style={{ background: '#62BE9D' }}></span>300 ml</span>
                    <span className='item-number'>299</span>
                </div>
            </div>
        </div>
    )

}

export default PanelStats