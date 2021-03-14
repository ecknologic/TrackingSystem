import React, { Fragment } from 'react';
import SalesResults from './panels/SalesResults';
import Header from '../../../components/ContentHeader';
import InvoiceOverview from './panels/InvoiceOverview';
import TotalStockStatus from './panels/TotalStockStatus';
import CustomersOverview from './panels/CustomersOverview';
import { getWarehoseId } from '../../../utils/constants';

const WarehouseDashboard = () => {
    const departmentId = getWarehoseId()

    return (
        <Fragment>
            <Header />
            <div className='dashboard-content-outer'>
                <div className='left-content'>
                    <div className='dashboard-content'>
                        <TotalStockStatus />
                        <div className='dashboard-content-inner'>
                            <div className='left-panel'>
                                <SalesResults depId={departmentId} />
                            </div>
                            <div className='right-panel'>
                                <InvoiceOverview />
                            </div>
                        </div>
                        <CustomersOverview />
                    </div>
                </div>
                <div className='right-content'>

                </div>
            </div>
        </Fragment>
    )
}

export default WarehouseDashboard