import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import React, { Fragment, useState } from 'react';
import Dashboard from './tabs/Dashboard';
import CreateInvoice from './tabs/CreateInvoice';
import Header from '../../../components/ContentHeader';
import '../../../sass/invoices.scss';

const Invoices = () => {
    const { active = '1' } = useParams()
    const [activeTab, setActiveTab] = useState(active)
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
            <div className='invoice-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Invoices" key="1">
                            <Dashboard reFetch={reFetch} onUpdate={() => setreFetch(!reFetch)} />
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