import { Tabs } from 'antd';
import { http } from '../../modules/http';
import React, { Fragment, useState, useCallback, useEffect, useMemo } from 'react';
import Header from '../../components/ContentHeader';
import Dispatches from './tabs/Dispatches';
import CreateDispatch from './tabs/CreateDispatch';
import ScrollUp from '../../components/ScrollUp';
import { getWarehoseId } from '../../utils/constants';
// import ExternalDispatches from './tabs/ExternalDispatches';
import ReportsDropdown from '../../components/ReportsDropdown';
// import CreateExternalDispatch from './tabs/CreateExternalDispatch';
import { getBatchIdOptions, getWarehouseOptions, getDriverOptions, getVehicleOptions } from '../../assets/fixtures';
import '../../sass/dispatches.scss'

const Dispatche = () => {
    const warehouseId = getWarehoseId()
    const [activeTab, setActiveTab] = useState('1')
    const [reFetch, setreFetch] = useState(false)
    const [batchList, setBatchList] = useState([])
    const [driverList, setDrivers] = useState([])
    const [warehouseList, setWarehouseList] = useState([])
    const [vehiclesList, setVehiclesList] = useState([])

    const batchIdOptions = useMemo(() => getBatchIdOptions(batchList), [batchList])
    const driverOptions = useMemo(() => getDriverOptions(driverList), [driverList])
    const vehicleOptions = useMemo(() => getVehicleOptions(vehiclesList), [vehiclesList])
    const warehouseOptions = useMemo(() => getWarehouseOptions(warehouseList), [warehouseList])
    const childProps = useMemo(() => ({ driverList, batchIdOptions, warehouseList, driverOptions, warehouseOptions, vehicleOptions }),
        [batchIdOptions, driverOptions, warehouseOptions, vehicleOptions])

    useEffect(() => {
        getBatchsList()
        getDriverList()
        getVehicleDetails()
        getWarehouseList()
    }, [])

    const getBatchsList = async () => {
        const data = await http.GET('/motherPlant/getPostProductionBatchIds')
        setBatchList(data)
    }

    const getDriverList = async () => {
        const data = await http.GET(`/warehouse/getdriverDetails/${warehouseId}`)
        setDrivers(data)
    }

    const getWarehouseList = async () => {
        const data = await http.GET('/motherPlant/getDepartmentsList?departmentType=warehouse')
        setWarehouseList(data)
    }

    const getVehicleDetails = async () => {
        const data = await http.GET('/motherPlant/getVehicleDetails')
        setVehiclesList(data)
    }

    const handleGoToTab = useCallback((key) => {
        setreFetch(!reFetch)
        setActiveTab(key)
    }, [reFetch])

    return (
        <Fragment>
            <ScrollUp dep={reFetch} />
            <Header />
            <div className='dispatches-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                        activeKey={activeTab}
                        onChange={(key) => setActiveTab(key)}
                    >
                        <TabPane tab="Dispatches" key="1">
                            <Dispatches reFetch={reFetch} />
                        </TabPane>
                        <TabPane tab="Create Dispatch" key="2">
                            <CreateDispatch goToTab={handleGoToTab} {...childProps} />
                        </TabPane>
                        {/* <TabPane tab="Create Dispatch (Outside)" key="3">
                            <CreateExternalDispatch goToTab={handleGoToTab} {...childProps} />
                        </TabPane>
                        <TabPane tab="Dispatches (Outside)" key="4">
                            <ExternalDispatches />
                        </TabPane> */}
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Dispatche