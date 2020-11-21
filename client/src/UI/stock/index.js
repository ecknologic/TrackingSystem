import { Tabs } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import Header from './header';
import Spinner from '../../components/Spinner';
import StockDetails from './tabs/StockDetails';
import NoContent from '../../components/NoContent';
import ReportsDropdown from '../../components/ReportsDropdown';

const Stock = () => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    return (
        <Fragment>
            <Header data={{}} />
            <div className='stock-manager-content'>
                <div className='tabs-container stock-manager-tabs'>
                    <Tabs
                        tabBarGutter={40}
                        tabBarExtraContent={<ReportsDropdown />}
                    >
                        <TabPane tab="Stock Details" key="1" />
                        <TabPane tab="Delivery" key="2" />
                        <TabPane tab="Orders" key="3" />
                        <TabPane tab="Staff" key="4" />
                        <TabPane tab="Settings" key="5" />
                    </Tabs>
                </div>
                <div className='date-picker-panel'>
                    <span>Date Picker goes here</span>
                </div>
                {
                    loading ? <NoContent content={<Spinner />} />
                        : <StockDetails />
                }

            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Stock