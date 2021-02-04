import React from 'react';
import RawMaterialStockCard from '../../../../components/RawMaterialStockCard';

const RawMaterialStock = () => {

    return (
        <div className='raw-material-panel'>
            <div className='panel-header'>
                <div className='head-container'>
                    <div className='title'>
                        Raw Material Stock Details
                    </div>
                </div>
            </div>
            <div className='panel-body'>
                <RawMaterialStockCard />
            </div>
        </div>
    )
}

export default RawMaterialStock