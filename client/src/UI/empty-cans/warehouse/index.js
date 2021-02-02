import { Tabs } from 'antd';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Dashboard from './tabs/Dashboard';
import { http } from '../../../modules/http';
import ReturnEmptyCans from './tabs/ReturnEmptyCans';
import Header from '../../../components/SimpleHeader';
import { getWarehoseId } from '../../../utils/constants';
import { getDepartmentOptions, getDriverOptions, getVehicleOptions, getWarehouseOptions } from '../../../assets/fixtures';
import '../../../sass/products.scss';

const EmptyCans = () => {
    const warehouseId = getWarehoseId()
    const [activeTab, setActiveTab] = useState('1')
    const [reFetch, setreFetch] = useState(false)
    const [departmentList, setDepartmentList] = useState([])
    const [motherplantList, setMotherplantList] = useState([])
    const [driverList, setDriverList] = useState([])
    const [vehicleList, setVehicleList] = useState([])

    const departmentOptions = useMemo(() => getDepartmentOptions(departmentList), [departmentList])
    const motherplantOptions = useMemo(() => getWarehouseOptions(motherplantList), [motherplantList])
    const driverOptions = useMemo(() => getDriverOptions(driverList), [driverList])
    const vehicleOptions = useMemo(() => getVehicleOptions(vehicleList), [vehicleList])
    const childProps = useMemo(() => ({ motherplantOptions, driverOptions, driverList, vehicleOptions, departmentOptions }),
        [motherplantOptions, driverOptions, vehicleOptions, departmentOptions])

    useEffect(() => {
        getDepartmentList()
        getMotherplantList()
        getDriverList()
        getVehicleList()
    }, [])

    const getDepartmentList = async () => {
        const url = '/bibo/getAllDepartmentsList'

        const data = await http.GET(url)
        setDepartmentList(data)
    }

    const getMotherplantList = async () => {
        const data = await http.GET('/bibo/getDepartmentsList?departmentType=MotherPlant')
        setMotherplantList(data)
    }

    const getDriverList = async () => {
        const url = `/bibo/getdriverDetails/${warehouseId}`
        const data = await http.GET(url)
        setDriverList(data)
    }

    const getVehicleList = async () => {
        const url = `/bibo/getVehicleDetails`
        const data = await http.GET(url)
        setVehicleList(data)
    }

    const handleGoToTab = useCallback((key) => {
        setreFetch(!reFetch)
        setActiveTab(key)
    }, [reFetch])

    const handleTabClick = (key) => {
        setActiveTab(key)
    }

    return (
        <Fragment>
            <Header title='Empty Cans' />
            <div className='employee-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Empty Cans" key="1">
                            <Dashboard reFetch={reFetch} {...childProps} />
                        </TabPane>
                        <TabPane tab="Return Empty Cans" key="2">
                            <ReturnEmptyCans goToTab={handleGoToTab} {...childProps} />
                        </TabPane>
                    </Tabs>
                </div>
            </div >
        </Fragment >
    )
}
const { TabPane } = Tabs;
export default EmptyCans