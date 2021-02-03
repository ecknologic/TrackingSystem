import React, { Fragment } from 'react';
import Header from '../../../components/ContentHeader';
import ProductionStatus from './panels/ProductionStatus';
import TotalStackStatus from './panels/TotalStackStatus';
import EmptyBottlesStock from './panels/EmptyBottlesStock';
import WaterQualityResults from './panels/WaterQualityResults';
import '../../../sass/dashboard.scss'

const MotherplantDashboard = () => {

    return (
        <Fragment>
            <Header />
            <div className='dashboard-content'>
                <ProductionStatus />
                <TotalStackStatus />
                <EmptyBottlesStock />
                <WaterQualityResults />
            </div>
        </Fragment>
    )
}

export default MotherplantDashboard