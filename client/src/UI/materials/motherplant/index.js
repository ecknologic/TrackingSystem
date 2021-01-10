import { Tabs } from 'antd';
import React, { Fragment } from 'react';
import Header from '../../../components/SimpleHeader';
import AddMaterials from '../warehouse/tabs/AddReceivedMaterials';
import ReportsDropdown from '../../../components/ReportsDropdown';
import RequestedMaterialStatus from '../warehouse/tabs/RequestedMaterialStatus';
import '../../../sass/materials.scss'

const MotherplantMaterials = () => {

    return (
        <Fragment>
            <Header title='Materials' />
            <div className='materials-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
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