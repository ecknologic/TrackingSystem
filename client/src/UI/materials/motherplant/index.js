import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import Header from './header';
import AddMaterials from '../warehouse/tabs/AddReceivedMaterials';
import ReportsDropdown from '../../../components/ReportsDropdown';
import RequestedMaterialStatus from '../warehouse/tabs/RequestedMaterialStatus';
import '../../../sass/materials.scss'

const MotherplantMaterials = () => {
    const [activeTab, setActiveTab] = useState('1')

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
                        <TabPane tab="Requested Materials" key="1">
                            <RequestedMaterialStatus />
                        </TabPane>
                        <TabPane tab="Received Materials" key="2">
                            <AddMaterials />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default MotherplantMaterials