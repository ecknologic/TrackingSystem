import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import Dashboard from './tabs/Dashboard';
import Header from '../../components/SimpleHeader';
import CreateProduct from './tabs/CreateProduct';
import '../../sass/plants.scss';

const Products = () => {

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
            <Header title='Products' />
            <div className='employee-content'>
                <div className='app-tabs-container'>
                    <Tabs
                        onChange={handleTabClick}
                        activeKey={activeTab}
                    >
                        <TabPane tab="Products" key="1">
                            <Dashboard reFetch={reFetch} />
                        </TabPane>
                        <TabPane tab="Create New Product" key="2">
                            <CreateProduct goToTab={handleGoToTab} />
                        </TabPane>
                    </Tabs>
                </div>
            </div >
        </Fragment >
    )
}
const { TabPane } = Tabs;
export default Products