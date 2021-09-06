import { Tabs } from 'antd';
import React, { Fragment, useMemo, useState } from 'react';
import Dashboard from './tabs/Dashboard';
import useUser from '../../utils/hooks/useUser';
import Vehicles from '../transport/tabs/Vehicles';
import Header from '../../components/SimpleHeader';
import { WAREHOUSEADMIN } from '../../utils/constants';
import CreateVehicle from '../transport/tabs/CreateVehicle';
import '../../sass/plants.scss';

const Drivers = () => {
    const { ROLE } = useUser()
    const [activeTab, setActiveTab] = useState('1')
    const [reFetch, setreFetch] = useState(false)

    const isWHAdmin = useMemo(() => ROLE === WAREHOUSEADMIN, [ROLE])
    const title = isWHAdmin ? 'Staff' : 'Drivers'

    const handleGoToTab = (key) => {
        setActiveTab(key)
        setreFetch(!reFetch)
    }

    const handleTabClick = (key) => {
        setActiveTab(key)
    }

    return (
        <Fragment>
            <Header title={title} />
            <div className='employee-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab={title} key="1">
                            <Dashboard isDriver />
                        </TabPane>
                        {
                            !isWHAdmin && (<>
                                <TabPane tab="Vehicles" key="2">
                                    <Vehicles reFetch={reFetch} />
                                </TabPane>
                                <TabPane tab="Add New Vehicle" key="3">
                                    <CreateVehicle goToTab={handleGoToTab} />
                                </TabPane>
                            </>)
                        }
                    </Tabs>
                </div>
            </div >
        </Fragment >
    )
}
const { TabPane } = Tabs;
export default Drivers