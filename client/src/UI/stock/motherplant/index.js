import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import Header from './header';
import StockDetails from './tabs/StockDetails';
import Production from './tabs/Production';
import ReportsDropdown from '../../../components/ReportsDropdown';
import { TODAYDATE } from '../../../utils/constants';
import DatePickerPanel from '../../../components/DatePickerPanel';

const MotherplantStock = () => {

    const [activeTab, setActiveTab] = useState('1')
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)

    const handleDateChange = (date) => {
        setSelectedDate(date)
    }

    return (
        <Fragment>
            <Header />
            <div className='stock-manager-content'>
                <div className='tabs-container stock-manager-tabs'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                        onTabClick={(key) => setActiveTab(key)}
                    >
                        <TabPane tab="Stock Details" key="1" />
                        <TabPane tab="Damaged Stock" key="2" />
                        <TabPane tab="Production" key="3" />
                    </Tabs>
                </div>
                <div className='date-picker-panel'>
                    <DatePickerPanel onChange={handleDateChange} />
                </div>
                {
                    activeTab === '1' ? <StockDetails date={selectedDate} />
                        : activeTab === '2' ? null
                            : activeTab === '3' ? <Production date={selectedDate} />
                                : null
                }
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default MotherplantStock