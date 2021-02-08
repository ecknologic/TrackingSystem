import React, { Fragment } from 'react';
import Header from '../../../components/ContentHeader';
import ProductionStatus from './panels/ProductionStatus';
import TotalStockStatus from './panels/TotalStockStatus';
import RawMaterialStock from './panels/RawMaterialStock';
import EmptyBottlesStock from './panels/EmptyBottlesStock';
import WaterQualityResults from './panels/WaterQualityResults';
import TodayDeliveryDetails from './panels/TodayDeliveryDetails';
import '../../../sass/dashboard.scss'

const MotherplantDashboard = () => {

    return (
        <Fragment>
            <Header />
            <div className='dashboard-content'>
                <ProductionStatus />
                <TotalStockStatus />
                <EmptyBottlesStock />
                <WaterQualityResults />
                <div className='bottom-panels-container'>
                    <RawMaterialStock />
                    <TodayDeliveryDetails />
                </div>
            </div>
        </Fragment>
    )
}

export default MotherplantDashboard