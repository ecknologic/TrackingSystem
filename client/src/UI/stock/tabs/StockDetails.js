import React from 'react';
import CASPanel from '../../../components/CASPanel';
import DCPanel from '../../../components/DCPanel';
import DSPanel from '../../../components/DSPanel';
import ECPanel from '../../../components/ECPanel';
import ERCPanel from '../../../components/ERCPanel';
import OFDPanel from '../../../components/OFDPanel';

const StockDetails = () => {

    return (
        <div className='stock-details-container'>
            <CASPanel />
            <OFDPanel />
            <DSPanel />
            <div className='empty-cans-header'>
                <span className='title'>Empty Cans details</span>
                <span className='msg'>Empty and damaged cans are not included in correct stock details</span>
            </div>
            <ECPanel />
            <ERCPanel />
            <DCPanel />
        </div>
    )
}

export default StockDetails