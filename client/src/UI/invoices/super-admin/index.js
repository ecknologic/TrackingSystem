import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import React, { Fragment, useMemo, useState } from 'react';
import Payments from './tabs/Payments';
import Dashboard from './tabs/Dashboard';
import CreateInvoice from './tabs/CreateInvoice';
import useUser from '../../../utils/hooks/useUser';
import Header from '../../../components/SimpleHeader';
import WarehouseInvoices from './tabs/WarehouseInvoices';
import '../../../sass/invoices.scss';
import { MARKETINGMANAGER } from '../../../utils/constants';

const Invoices = () => {
    const { ROLE } = useUser()
    const { tab = '1' } = useParams()
    const [activeTab, setActiveTab] = useState(tab)
    const [reFetch, setreFetch] = useState(false)
    const isSMManager = useMemo(() => ROLE === MARKETINGMANAGER, [ROLE])

    const handleGoToTab = (key) => {
        setActiveTab(key)
        setreFetch(!reFetch)
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
                            <Dashboard reFetch={reFetch} onUpdate={() => setreFetch(!reFetch)} />
                        </TabPane>
                        {
                            !isSMManager &&
                            (
                                <>
                                    <TabPane tab="Create New Invoice" key="2">
                                        <CreateInvoice goToTab={handleGoToTab} />
                                    </TabPane>
                                    <TabPane tab="Received Payments" key="3">
                                        <Payments reFetch={reFetch} onUpdate={() => setreFetch(!reFetch)} />
                                    </TabPane>
                                    <TabPane tab="Warehouse Invoices" key="4">
                                        <WarehouseInvoices reFetch={reFetch} />
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