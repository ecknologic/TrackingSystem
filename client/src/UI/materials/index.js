import { Tabs } from 'antd';
import React, { Fragment, useState, useCallback, useMemo } from 'react';
import Header from '../../components/ContentHeader';
import RequestMaterial from './tabs/RequestMaterial';
import ReceivedMaterials from './tabs/ReceivedMaterials';
import RequestedMaterialStatus from './tabs/RequestedMaterialStatus';
import AddMaterials from './tabs/AddReceivedMaterials';
import ReportsDropdown from '../../components/ReportsDropdown';
import NoContent from '../../components/NoContent';
import { getMaterialOpitons, getVendorOptions } from '../../assets/fixtures';
import '../../sass/materials.scss'

const Dispatch = () => {
    const [activeTab, setActiveTab] = useState('1')

    const materialOptions = useMemo(() => getMaterialOpitons(), [])
    const vendorOptions = useMemo(() => getVendorOptions(), [])
    const childProps = useMemo(() => ({ materialOptions, vendorOptions }), [materialOptions, vendorOptions])

    const handleGoToTab = useCallback((key) => setActiveTab(key), [])

    return (
        <Fragment>
            <Header />
            <div className='materials-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                        activeKey={activeTab}
                        onChange={(key) => setActiveTab(key)}
                    >
                        <TabPane tab="Materials Request" key="1">
                            <RequestMaterial goToTab={handleGoToTab} {...childProps} />
                        </TabPane>
                        <TabPane tab="Requested Material Status" key="2">
                            <RequestedMaterialStatus />
                        </TabPane>
                        <TabPane tab="Add Received Materials" key="3">
                            <AddMaterials />
                        </TabPane>
                        <TabPane tab="Received Materials" key="4">
                            <ReceivedMaterials />
                        </TabPane>
                        <TabPane tab="Current Stock" key="5">
                            <NoContent content='Design is in progress' />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Dispatch