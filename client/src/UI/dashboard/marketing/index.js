import React, { Fragment } from 'react';
import Header from '../../../components/ContentHeader';
import VisitedCustomers from './panels/VisitedCustomers';
import PendingApprovals from './panels/PendingApprovals';
import ExecutiveOverview from './panels/ExecutiveOverview';
import CustomersOverview from '../super-admin/panels/CustomersOverview';

const MarketingDashboard = () => {

    return (
        <Fragment>
            <Header />
            <div className='dashboard-content'>
                <CustomersOverview />
                <div className='dashboard-content-other'>
                    <div className='left-content'>
                        <VisitedCustomers />
                        <ExecutiveOverview />
                    </div>
                    <div className='right-content'>
                        <PendingApprovals />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default MarketingDashboard