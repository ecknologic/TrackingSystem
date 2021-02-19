import React, { Fragment } from 'react';
import Header from '../../../components/ContentHeader';
import ProductionStatus from './panels/ProductionStatus';
import TotalStockStatus from './panels/TotalStockStatus';
import RawMaterialStock from './panels/RawMaterialStock';
import EmptyBottlesStock from './panels/EmptyBottlesStock';
import WaterQualityResults from './panels/WaterQualityResults';
import DispatchDetails from './panels/DispatchDetails';
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
                    <DispatchDetails />
                </div>
            </div>
        </Fragment>
    )
}

export default MotherplantDashboard