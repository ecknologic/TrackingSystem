import React, { Fragment } from 'react';
import Header from '../../../components/ContentHeader';
import ProductionStatus from './ProductionStatus';
import '../../../sass/dashboard.scss'

const MotherplantDashboard = () => {

    return (
        <Fragment>
            <Header />
            <div className='dashboard-content'>
                <ProductionStatus />
            </div>
        </Fragment>
    )
}

export default MotherplantDashboard