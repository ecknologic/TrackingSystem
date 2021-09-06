import axios from 'axios';
import { Tabs } from 'antd';
import { useParams } from 'react-router';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import Orders from './tabs/Orders';
import Delivery from './tabs/Delivery';
import { http } from '../../../modules/http';
import DeliveredDC from './tabs/DeliveredDC';
import StockDetails from './tabs/StockDetails';
import DamagedStock from './tabs/DamagedStock';
import StockReceived from './tabs/StockReceived';
import useUser from '../../../utils/hooks/useUser';
import { TODAYDATE } from '../../../utils/constants';
import DeliveryDetails from './tabs/DeliveryDetails';
import Header from '../../../components/ContentHeader';
import ReportsDropdown from '../../../components/ReportsDropdown';
import DatePickerPanel from '../../../components/DatePickerPanel';
import '../../../sass/stock.scss'

const WarehouseStock = () => {
    const { tab = '1' } = useParams()
    const { WAREHOUSEID } = useUser()
    const [activeTab, setActiveTab] = useState(tab)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [routeList, setRouteList] = useState([])
    const [driverList, setDriverList] = useState([])
    const [vehicleList, setVehicleList] = useState([])
    const [locationList, setLocationList] = useState([])
    const [warehouseList, setWarehouseList] = useState([])
    const [motherplantList, setMotherplantList] = useState([])
    const showDatePanel = activeTab === '1' || activeTab === '2' || activeTab === '5'

    const childProps = useMemo(() => ({ driverList, routeList, warehouseList, vehicleList, locationList, motherplantList }),
        [driverList, routeList, warehouseList, vehicleList, locationList, motherplantList])
    const departmentList = useMemo(() => {
        const WHList = warehouseList.filter(item => item.departmentId !== WAREHOUSEID);
        return [...motherplantList, ...WHList]
    }, [warehouseList, motherplantList])
    const source = useMemo(() => axios.CancelToken.source(), [selectedDate, activeTab]);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getRouteList()
        getDriverList()
        getVehicleList()
        getLocationList()
        getWarehouseList()
        getMotherplantList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getRouteList = async () => {
        const url = `customer/getRoutes/${WAREHOUSEID}`

        try {
            const data = await http.GET(axios, url, config)
            setRouteList(data)
        } catch (error) { }
    }

    const getDriverList = async () => {
        const url = `bibo/getdriverDetails/${WAREHOUSEID}`

        try {
            const data = await http.GET(axios, url, config)
            setDriverList(data)
        } catch (error) { }
    }

    const getVehicleList = async () => {
        const url = `bibo/getVehicleDetails`

        try {
            const data = await http.GET(axios, url, config)
            setVehicleList(data)
        } catch (error) { }
    }

    const getLocationList = async () => {
        const url = `bibo/getList/location`

        try {
            const data = await http.GET(axios, url, config)
            setLocationList(data)
        } catch (error) { }
    }

    const getWarehouseList = async () => {
        const url = 'bibo/getDepartmentsList?departmentType=warehouse'

        try {
            const data = await http.GET(axios, url, config)
            setWarehouseList(data)
        } catch (ex) { }
    }

    const getMotherplantList = async () => {
        const url = 'bibo/getDepartmentsList?departmentType=MotherPlant'

        try {
            const data = await http.GET(axios, url, config)
            setMotherplantList(data)
        } catch (error) { }
    }

    const handleDateChange = (date) => {
        setSelectedDate(date)
    }

    const handleTabClick = (key) => {
        setActiveTab(key)
    }

    const handleDateSelect = () => http.ABORT(source)

    return (
        <Fragment>
            <Header />
            <div className='stock-manager-content'>
                <div className='app-tabs-container app-hidden-panes'>
                    <Tabs
                        // Below item should be: uncommented 
                        // tabBarExtraContent={<ReportsDropdown />}
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Stock Details" key="1" />
                        <TabPane tab="Delivery" key="2" />
                        <TabPane tab="Orders" key="3" />
                        <TabPane tab="Delivered DC" key="4" />
                        <TabPane tab="Delivery Details" key="5" />
                        <TabPane tab="Stock Received" key="6" />
                        <TabPane tab="Damaged Stock" key="7" />
                    </Tabs>
                </div>
                {
                    showDatePanel && (
                        <div className='date-picker-panel'>
                            <DatePickerPanel
                                onChange={handleDateChange}
                                onSelect={handleDateSelect}
                                disabledDate={activeTab !== '2'}
                            />
                        </div>
                    )
                }
                {
                    activeTab === '1' ? <StockDetails date={selectedDate} {...childProps} />
                        : activeTab === '2' ? <Delivery date={selectedDate} {...childProps} />
                            : activeTab === '3' ? <Orders {...childProps} />
                                : activeTab === '4' ? <DeliveredDC />
                                    : activeTab === '5' ? <DeliveryDetails date={selectedDate} {...childProps} />
                                        : activeTab === '6' ? <StockReceived departmentList={departmentList} />
                                            : activeTab === '7' ? <DamagedStock departmentList={departmentList} />
                                                : null
                }
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default WarehouseStock