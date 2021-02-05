import { Tabs } from 'antd';
import React, { Fragment } from 'react';
import Header from '../../../components/SimpleHeader';
import ReportsDropdown from '../../../components/ReportsDropdown';
import ReceivedMaterials from '../motherplant/tabs/ReceivedMaterials';
import RequestedMaterialStatus from '../motherplant/tabs/RequestedMaterialStatus';
import '../../../sass/materials.scss'

const Materials = () => {

    return (
        <Fragment>
            <Header title='Materials' />
            <div className='materials-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                    >
                        <TabPane tab="Requested Materials" key="1">
                            <RequestedMaterialStatus isSuperAdmin />
                        </TabPane>
                        <TabPane tab="Received Materials" key="2">
                            <ReceivedMaterials isSuperAdmin />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Materials