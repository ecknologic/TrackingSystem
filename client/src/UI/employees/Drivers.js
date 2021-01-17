import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import Dashboard from './tabs/Dashboard';
import Header from '../../components/SimpleHeader';
import Vehicles from '../transport/tabs/Vehicles';
import CreateVehicle from '../transport/tabs/CreateVehicle';
import '../../sass/plants.scss';

const Drivers = () => {

    const [activeTab, setActiveTab] = useState('1')

    const handleGoToTab = (key) => {
        setActiveTab(key)
    }

    const handleTabClick = (key) => {
        setActiveTab(key)
    }

    return (
        <Fragment>
            <Header title='Drivers' />
            <div className='employee-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Drivers" key="1">
                            <Dashboard />
                        </TabPane>
                        <TabPane tab="Vehicles" key="2">
                            <Vehicles />
                        </TabPane>
                        <TabPane tab="Create New Vehicle" key="3">
                            <CreateVehicle goToTab={handleGoToTab} />
                        </TabPane>
                    </Tabs>
                </div>
            </div >
        </Fragment >
    )
}
const { TabPane } = Tabs;
export default Drivers