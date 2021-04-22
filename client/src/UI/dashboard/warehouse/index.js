import React, { Fragment } from 'react';
import StockStatus from './panels/StockStatus';
import TodaysOrders from './panels/TodaysOrders';
import SalesResults from './panels/SalesResults';
import useUser from '../../../utils/hooks/useUser';
import Header from '../../../components/ContentHeader';
import InvoiceOverview from './panels/InvoiceOverview';
import CustomersOverview from './panels/CustomersOverview';

const WarehouseDashboard = () => {
    const { WAREHOUSEID } = useUser()

    return (
        <Fragment>
            <Header />
            <div className='dashboard-content-outer'>
                <div className='left-content'>
                    <div className='dashboard-content'>
                        <StockStatus />
                        <div className='dashboard-content-inner'>
                            <div className='left-panel'>
                                <SalesResults depId={WAREHOUSEID} />
                            </div>
                            <div className='right-panel'>
                                <InvoiceOverview />
                            </div>
                        </div>
                        <CustomersOverview />
                    </div>
                </div>
                <div className='right-content'>
                    <TodaysOrders />
                </div>
            </div>
        </Fragment>
    )
}

export default WarehouseDashboard