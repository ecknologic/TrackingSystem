import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import Header from '../../../components/ContentHeader';
import ReportsDropdown from '../../../components/ReportsDropdown';
import RequestedStockStatus from '../warehouse/tabs/RequestedStockStatus';
import '../../../sass/materials.scss'

const MotherplantStockRequest = () => {
    const [activeTab, setActiveTab] = useState('1')

    const handleTabChange = (key) => {
        setActiveTab(key)
    }

    return (
        <Fragment>
            <Header />
            <div className='materials-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                        activeKey={activeTab}
                        onChange={handleTabChange}
                    >
                        <TabPane tab="Requested Stock" key="1">
                            <RequestedStockStatus />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default MotherplantStockRequest