import axios from 'axios';
import { Tabs } from 'antd';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Dashboard from './tabs/Dashboard';
import { http } from '../../../modules/http';
import ReturnEmptyCans from './tabs/ReturnEmptyCans';
import Header from '../../../components/ContentHeader';
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
    const [isFetched, setIsFetched] = useState(false)

    const departmentOptions = useMemo(() => getDepartmentOptions(departmentList), [departmentList])
    const motherplantOptions = useMemo(() => getWarehouseOptions(motherplantList), [motherplantList])
    const driverOptions = useMemo(() => getDriverOptions(driverList), [driverList])
    const vehicleOptions = useMemo(() => getVehicleOptions(vehicleList), [vehicleList])
    const childProps = useMemo(() => ({ motherplantOptions, driverOptions, driverList, vehicleOptions, departmentOptions }),
        [motherplantOptions, driverOptions, vehicleOptions, departmentOptions])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    const getDepartmentList = async () => {
        const url = '/bibo/getAllDepartmentsList'

        try {
            const data = await http.GET(axios, url, config)
            setDepartmentList(data)
        } catch (error) { }
    }

    const getMotherplantList = async () => {
        const url = '/bibo/getDepartmentsList?departmentType=MotherPlant'

        try {
            const data = await http.GET(axios, url, config)
            setMotherplantList(data)
        } catch (error) { }
    }

    const getDriverList = async () => {
        const url = `/bibo/getdriverDetails/${warehouseId}`

        try {
            const data = await http.GET(axios, url, config)
            setDriverList(data)
        } catch (error) { }
    }

    const getVehicleList = async () => {
        const url = `/bibo/getVehicleDetails`

        try {
            const data = await http.GET(axios, url, config)
            setVehicleList(data)
        } catch (error) { }
    }

    const handleGoToTab = useCallback((key) => {
        setreFetch(!reFetch)
        setActiveTab(key)
    }, [reFetch])

    const handleTabClick = (key) => {
        setActiveTab(key)
    }

    const fetchList = async () => {
        if (!isFetched) {
            const p2 = getDriverList()
            const p3 = getVehicleList()
            const p4 = getDepartmentList()
            const p1 = getMotherplantList()
            await Promise.all([p1, p2, p3, p4])
            setIsFetched(true)
        }
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
                            <Dashboard reFetch={reFetch} isFetched={isFetched} fetchList={fetchList} {...childProps} />
                        </TabPane>
                        <TabPane tab="Add Empty Cans" key="2">
                            <ReturnEmptyCans goToTab={handleGoToTab} fetchList={fetchList} {...childProps} />
                        </TabPane>
                    </Tabs>
                </div>
            </div >
        </Fragment >
    )
}
const { TabPane } = Tabs;
export default EmptyCans