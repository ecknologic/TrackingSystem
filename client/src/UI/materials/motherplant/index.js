import axios from 'axios';
import { Tabs } from 'antd';
import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import { http } from '../../../modules/http';
import CurrentStock from './tabs/CurrentStock';
import ScrollUp from '../../../components/ScrollUp';
import RequestMaterial from './tabs/RequestMaterial';
import AddMaterials from './tabs/AddReceivedMaterials';
import Header from '../../../components/ContentHeader';
import ReceivedMaterials from './tabs/ReceivedMaterials';
import { getDropdownOptions } from '../../../assets/fixtures';
import ReportsDropdown from '../../../components/ReportsDropdown';
import RequestedMaterialStatus from './tabs/RequestedMaterialStatus';
import '../../../sass/materials.scss'

const Materials = () => {
    const [activeTab, setActiveTab] = useState('1')
    const [reFetch, setreFetch] = useState(false)
    const [vendorList, setVendorList] = useState([])
    const [materialList, setMaterialList] = useState([])

    const materialOptions = useMemo(() => getDropdownOptions(materialList), [materialList])
    const vendorOptions = useMemo(() => getDropdownOptions(vendorList), [vendorList])
    const childProps = useMemo(() => ({ materialOptions, vendorOptions }), [materialOptions, vendorOptions])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getVendorList()
        getMaterialList()
    }, [])

    const getVendorList = async () => {
        const url = `bibo/getList/vendor`

        try {
            const data = await http.GET(axios, url, config)
            setVendorList(data)
        } catch (error) { }
    }

    const getMaterialList = async () => {
        const url = `bibo/getList/itemName`

        try {
            const data = await http.GET(axios, url, config)
            setMaterialList(data)
        } catch (error) { }
    }

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
                        <TabPane tab="Current Stock" key="1">
                            <CurrentStock />
                        </TabPane>
                        <TabPane tab="Materials Request" key="2">
                            <RequestMaterial goToTab={handleGoToTab} {...childProps} />
                        </TabPane>
                        <TabPane tab="Requested Material Status" key="3">
                            <RequestedMaterialStatus reFetch={reFetch} />
                        </TabPane>
                        <TabPane tab="Add Received Materials" key="4">
                            <AddMaterials onUpdate={toggleRefetch} />
                        </TabPane>
                        <TabPane tab="Received Materials" key="5">
                            <ReceivedMaterials />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Materials