import React from 'react';
import DashboardPanelHeader from '../../../components/DashboardPanelHeader';

const ProductionStatus = () => {

    return (
        <div className='dashboard-panel'>
            <DashboardPanelHeader title='Production Status' />
            <DashboardPanelHeader title='Total Stack Status' />
        </div>
    )
}

export default ProductionStatus