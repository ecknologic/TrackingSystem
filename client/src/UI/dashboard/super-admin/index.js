import React, { Fragment } from 'react';
// import PieChart from '../../../components/PieChart';
// import ColumnChart from '../..   /../components/ColumnChart';
import Header from '../../../components/ContentHeader';
import CustomersOverview from './panels/CustomersOverview';
import InvoiceOverview from './panels/InvoiceOverview';
import ProductionResults from './panels/ProductionResults';
import SalesResults from './panels/SalesResults';
import TotalBusiness from './panels/TotalBusiness';
import WaterQualityResults from './panels/WaterQualityResults';

const SuperAdminDashboard = () => {

    return (
        <Fragment>
            <Header />
            <div className='dashboard-content'>
                <div className='equal-panels-container'>
                    <ProductionResults />
                    <SalesResults />
                </div>
                <CustomersOverview />
                <div className='equal-panels-container'>
                    <TotalBusiness />
                    <InvoiceOverview />
                </div>
                <WaterQualityResults />
            </div>
        </Fragment>
    )
}

export default SuperAdminDashboard