import { Tabs } from 'antd';
import React, { Fragment, useMemo, useState } from 'react';
import Dashboard from './tabs/Dashboard';
import useUser from '../../utils/hooks/useUser';
import CreateVendor from './tabs/CreateVendor';
import Header from '../../components/SimpleHeader';
import { ACCOUNTSADMIN, MARKETINGADMIN, MARKETINGMANAGER, SUPERADMIN } from '../../utils/constants';
import '../../sass/plants.scss';

const Vendors = () => {
    const { ROLE } = useUser()
    const [activeTab, setActiveTab] = useState('1')
    const [reFetch, setreFetch] = useState(false)
    const isAdmin = useMemo(() => ROLE === SUPERADMIN || ROLE === ACCOUNTSADMIN ||
        ROLE === MARKETINGADMIN || ROLE === MARKETINGMANAGER, [ROLE])

    const handleGoToTab = (key) => {
        setActiveTab(key)
        setreFetch(!reFetch)
    }

    const handleTabClick = (key) => {
        setActiveTab(key)
    }

    return (
        <Fragment>
            <Header title='Vendors' />
            <div className='employee-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Vendors" key="1">
                            <Dashboard reFetch={reFetch} />
                        </TabPane>
                        {
                            isAdmin &&
                            (
                                <TabPane tab="Add New Vendor" key="2">
                                    <CreateVendor goToTab={handleGoToTab} />
                                </TabPane>
                            )
                        }
                    </Tabs>
                </div>
            </div >
        </Fragment >
    )
}
const { TabPane } = Tabs;
export default Vendors