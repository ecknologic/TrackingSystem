import { Tabs } from 'antd';
import React, { Fragment, useState, useCallback } from 'react';
import ScrollUp from '../../../components/ScrollUp';
import RequestStock from './tabs/RequestStock';
import Header from '../../../components/ContentHeader';
import ReportsDropdown from '../../../components/ReportsDropdown';
import RequestedStockStatus from './tabs/RequestedStockStatus';
import '../../../sass/materials.scss'

const WarehouseMaterials = () => {
    const [activeTab, setActiveTab] = useState('1')
    const [reFetch, setreFetch] = useState(false)

    const handleGoToTab = useCallback((key) => {
        toggleRefetch()
        setActiveTab(key)
    }, [reFetch])

    const toggleRefetch = useCallback(() => {
        setreFetch(!reFetch)
    }, [reFetch])

    const handleTabChange = (key) => {
        setActiveTab(key)
        key === '2' && toggleRefetch()
    }

    return (
        <Fragment>
            <ScrollUp dep={reFetch} />
            <Header />
            <div className='materials-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                        activeKey={activeTab}
                        onChange={handleTabChange}
                    >
                        <TabPane tab="Stock Request" key="1">
                            <RequestStock goToTab={handleGoToTab} />
                        </TabPane>
                        <TabPane tab="Requested Stock Status" key="2">
                            <RequestedStockStatus reFetch={reFetch} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default WarehouseMaterials