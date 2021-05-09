import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import React, { Fragment, useMemo, useState } from 'react';
import Dashboard from './tabs/Dashboard';
import CreateInvoice from './tabs/CreateInvoice';
import useUser from '../../../utils/hooks/useUser';
import Header from '../../../components/ContentHeader';
import SimpleHeader from '../../../components/SimpleHeader';
import { MARKETINGMANAGER } from '../../../utils/constants';
import '../../../sass/invoices.scss';

const Invoices = () => {
    const { tab = '1' } = useParams()
    const { ROLE } = useUser()
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

    const renderHeader = () => {
        if (isSMManager) return <SimpleHeader title='Invoices' />
        return <Header title='Invoices' />
    }

    return (
        <Fragment>
            {renderHeader()}
            <div className='invoice-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Invoices" key="1">
                            <Dashboard reFetch={reFetch} />
                        </TabPane>
                        {
                            isSMManager ? null
                                : <TabPane tab="Create New Invoice" key="2">
                                    <CreateInvoice goToTab={handleGoToTab} />
                                </TabPane>
                        }
                    </Tabs>
                </div>
            </div >
        </Fragment >
    )
}
const { TabPane } = Tabs;
export default Invoices