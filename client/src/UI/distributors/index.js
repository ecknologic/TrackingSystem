import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import Dashboard from './tabs/Dashboard';
import Header from '../../components/SimpleHeader';
import CreateEmployee from './tabs/CreateDistributor';
import '../../sass/plants.scss';

const Distributors = () => {

    const [activeTab, setActiveTab] = useState('1')
    const [reFetch, setreFetch] = useState(false)

    const handleGoToTab = (key) => {
        setActiveTab(key)
        setreFetch(!reFetch)
    }

    const handleTabClick = (key) => {
        setActiveTab(key)
    }

    return (
        <Fragment>
            <Header title='Distributors' />
            <div className='employee-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Distributors" key="1">
                            <Dashboard reFetch={reFetch} />
                        </TabPane>
                        <TabPane tab="Create New Distributor" key="2">
                            <CreateEmployee goToTab={handleGoToTab} />
                        </TabPane>
                    </Tabs>
                </div>
            </div >
        </Fragment >
    )
}
const { TabPane } = Tabs;
export default Distributors