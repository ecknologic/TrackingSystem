import axios from 'axios';
import { Tabs } from 'antd';
import { useParams } from 'react-router';
import React, { Fragment, useMemo, useState } from 'react';
import Orders from './tabs/Orders';
import Staff from './tabs/Staff';
import Delivery from './tabs/Delivery';
import { http } from '../../../modules/http';
import DeliveredDC from './tabs/DeliveredDC';
import StockDetails from './tabs/StockDetails';
import StockReceived from './tabs/StockReceived';
import { TODAYDATE } from '../../../utils/constants';
import Header from '../../../components/ContentHeader';
import ReportsDropdown from '../../../components/ReportsDropdown';
import DatePickerPanel from '../../../components/DatePickerPanel';
import '../../../sass/stock.scss'

const WarehouseStock = () => {
    const { tab = '1' } = useParams()
    const [activeTab, setActiveTab] = useState(tab)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const showDatePanel = activeTab === '1' || activeTab === '2'
    const source = useMemo(() => axios.CancelToken.source(), [selectedDate, activeTab]);

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
                        tabBarExtraContent={<ReportsDropdown />}
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Stock Details" key="1" />
                        <TabPane tab="Delivery" key="2" />
                        <TabPane tab="Orders" key="3" />
                        <TabPane tab="Delivered DC" key="4" />
                        <TabPane tab="Staff" key="5" />
                        <TabPane tab="Stock Received" key="6" />
                    </Tabs>
                </div>
                {
                    showDatePanel && (
                        <div className='date-picker-panel'>
                            <DatePickerPanel onChange={handleDateChange} onSelect={handleDateSelect} />
                        </div>
                    )
                }
                {
                    activeTab === '1' ? <StockDetails date={selectedDate} source={source} />
                        : activeTab === '2' ? <Delivery date={selectedDate} source={source} />
                            : activeTab === '3' ? <Orders />
                                : activeTab === '4' ? <DeliveredDC />
                                    : activeTab === '5' ? <Staff />
                                        : activeTab === '6' ? <StockReceived />
                                            : null
                }
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default WarehouseStock