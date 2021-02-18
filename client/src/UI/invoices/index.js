import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import Dashboard from './tabs/Dashboard';
import Header from '../../components/SimpleHeader';
import CreateInvoice from './tabs/CreateInvoice';
// import '../../sass/invoices.scss';

const Invoices = () => {

    const [activeTab, setActiveTab] = useState('1')
    const [reFetch, setreFetch] = useState(false)

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
            <div className='employee-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Invoices" key="1">
                            <Dashboard reFetch={reFetch} />
                        </TabPane>
                        <TabPane tab="Create New Invoice" key="2">
                            <CreateInvoice goToTab={handleGoToTab} />
                        </TabPane>
                    </Tabs>
                </div>
            </div >
        </Fragment >
    )
}
const { TabPane } = Tabs;
export default Invoices