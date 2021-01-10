import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import Dashboard from '../tabs/Dashboard';
import Header from '../../../components/SimpleHeader';
import CreateNewPlant from '../tabs/CreateNewPlant';
import '../../../sass/plants.scss';

const Warehouses = () => {

    const [activeTab, setActiveTab] = useState('1')

    const handleGoToTab = (key) => {
        setActiveTab(key)
    }

    const handleTabClick = (key) => {
        setActiveTab(key)
    }

    return (
        <Fragment>
            <Header title='Warehouses' />
            <div className='plantcontent'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Warehouses" key="1">
                            <Dashboard />
                        </TabPane>
                        <TabPane tab="Create New Warehouse" key="2">
                            <CreateNewPlant goToTab={handleGoToTab} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Warehouses