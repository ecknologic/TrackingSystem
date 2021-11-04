import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import React, { Fragment, useMemo, useState } from 'react';
import Payments from './tabs/Payments';
import Dashboard from './tabs/Dashboard';
import CreateInvoice from './tabs/CreateInvoice';
import useUser from '../../../utils/hooks/useUser';
import Header from '../../../components/SimpleHeader';
import WarehouseInvoices from './tabs/WarehouseInvoices';
import { ACCOUNTSADMIN, SUPERADMIN } from '../../../utils/constants';
import '../../../sass/invoices.scss';

const Invoices = () => {
    const { ROLE } = useUser()
    const { tab = '1' } = useParams()
    const [activeTab, setActiveTab] = useState(tab)
    const [reFetch1, setreFetch1] = useState(false)
    const [reFetch2, setreFetch2] = useState(false)
    const isAdmin = useMemo(() => ROLE === SUPERADMIN || ROLE === ACCOUNTSADMIN, [ROLE])

    const handleGoToTab1 = (key) => {
        setActiveTab(key)
        setreFetch1(!reFetch1)
    }

    const handleTabClick = (key) => {
        setActiveTab(key)
    }

    return (
        <Fragment>
            <Header title='Invoices' />
            <div className='invoice-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Invoices" key="1">
                            <Dashboard reFetch={reFetch1} onUpdate={() => setreFetch2(!reFetch2)} isAdmin={isAdmin} />
                        </TabPane>
                        {
                            (isAdmin) &&
                            (
                                <>
                                    <TabPane tab="Create New Invoice" key="2">
                                        <CreateInvoice goToTab={handleGoToTab1} />
                                    </TabPane>
                                    <TabPane tab="Received Payments" key="3">
                                        <Payments reFetch={reFetch2} />
                                    </TabPane>
                                    <TabPane tab="Warehouse Invoices" key="4">
                                        <WarehouseInvoices />
                                    </TabPane>
                                </>
                            )
                        }
                    </Tabs>
                </div>
            </div >
        </Fragment >
    )
}
const { TabPane } = Tabs;
export default Invoices