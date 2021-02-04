import React from 'react';
import PanelHeader from '../../../../components/PanelHeader';
import ProductionStatusCard from '../../../../components/ProductionStatusCard';

const ProductionStatus = () => {

    return (
        <>
            <PanelHeader title='Production Status' />
            <div className='panel-body prod-status-panel'>
                <ProductionStatusCard title='20 Ltrs' total='2345' />
                <ProductionStatusCard title='1 Ltrs' total='2345' />
                <ProductionStatusCard title='500 ml' total='2345' />
                <ProductionStatusCard title='300 ml' total='2345' />
            </div>
        </>
    )
}

export default ProductionStatus