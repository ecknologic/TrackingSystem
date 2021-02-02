import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import Orders from './tabs/Orders';
import Staff from './tabs/Staff';
import Delivery from './tabs/Delivery';
import StockDetails from './tabs/StockDetails';
import StockReceived from './tabs/StockReceived';
import { TODAYDATE } from '../../../utils/constants';
import NoContent from '../../../components/NoContent';
import Header from '../../../components/ContentHeader';
import ReportsDropdown from '../../../components/ReportsDropdown';
import DatePickerPanel from '../../../components/DatePickerPanel';
import '../../../sass/stock.scss'

const WarehouseStock = () => {

    const [activeTab, setActiveTab] = useState('1')
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const showDatePanel = activeTab === '1' || activeTab === '2'

    const handleDateChange = (date) => {
        setSelectedDate(date)
    }

    return (
        <Fragment>
            <Header />
            <div className='stock-manager-content'>
                <div className='app-tabs-container app-hidden-panes'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                        onChange={(key) => setActiveTab(key)}
                    >
                        <TabPane tab="Stock Details" key="1" />
                        <TabPane tab="Delivery" key="2" />
                        <TabPane tab="Orders" key="3" />
                        <TabPane tab="Staff" key="4" />
                        <TabPane tab="Stock Received" key="5" />
                        <TabPane tab="Settings" key="6" disabled />
                    </Tabs>
                </div>
                {
                    showDatePanel && (
                        <div className='date-picker-panel'>
                            <DatePickerPanel onChange={handleDateChange} />
                        </div>
                    )
                }
                {
                    activeTab === '1' ? <StockDetails date={selectedDate} />
                        : activeTab === '2' ? <Delivery date={selectedDate} />
                            : activeTab === '3' ? <Orders />
                                : activeTab === '4' ? <Staff />
                                    : activeTab === '5' ? <StockReceived />
                                        : null
                }
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default WarehouseStock