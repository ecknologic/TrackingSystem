import { Tabs } from 'antd';
import React, { Fragment, useState, useCallback, useMemo } from 'react';
import ScrollUp from '../../../components/ScrollUp';
import NoContent from '../../../components/NoContent';
import Header from '../../../components/ContentHeader';
import RequestMaterial from '../warehouse/tabs/RequestMaterial';
import AddMaterials from '../warehouse/tabs/AddReceivedMaterials';
import ReceivedMaterials from '../warehouse/tabs/ReceivedMaterials';
import ReportsDropdown from '../../../components/ReportsDropdown';
import RequestedMaterialStatus from '../warehouse/tabs/RequestedMaterialStatus';
import { getMaterialOpitons, getVendorOptions } from '../../../assets/fixtures';
import '../../../sass/materials.scss'

const MotherplantMaterials = () => {
    const [activeTab, setActiveTab] = useState('1')
    const [reFetch, setreFetch] = useState(false)

    const materialOptions = useMemo(() => getMaterialOpitons(), [])
    const vendorOptions = useMemo(() => getVendorOptions(), [])
    const childProps = useMemo(() => ({ materialOptions, vendorOptions }), [materialOptions, vendorOptions])


    const handleGoToTab = useCallback((key) => {
        toggleRefetch()
        setActiveTab(key)
    }, [reFetch])

    const toggleRefetch = useCallback(() => {
        setreFetch(!reFetch)
    }, [reFetch])

    return (
        <Fragment>
            <ScrollUp dep={reFetch} />
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
                            <RequestedMaterialStatus reFetch={reFetch} />
                        </TabPane>
                        <TabPane tab="Add Received Materials" key="3">
                            <AddMaterials onUpdate={toggleRefetch} />
                        </TabPane>
                        <TabPane tab="Received Materials" key="4">
                            <ReceivedMaterials />
                        </TabPane>
                        <TabPane tab="Current Stock" key="5" disabled>
                            <NoContent content='Design is in progress' />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default MotherplantMaterials