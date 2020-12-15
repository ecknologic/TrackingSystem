import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import Header from './header';
import CreateDispatch from './tabs/CreateDispatch';
import Dispatches from './tabs/Dispatches';
import ReportsDropdown from '../../components/ReportsDropdown';

const Dispatch = () => {

    const [activeTab, setActiveTab] = useState('1')

    return (
        <Fragment>
            <Header />
            <div className='stock-manager-content dispatches-content'>
                <div className='tabs-container stock-manager-tabs'>
                    <Tabs
                        tabBarExtraContent={<ReportsDropdown />}
                        onTabClick={(key) => setActiveTab(key)}
                    >
                        <TabPane tab="Dispatches" key="1" />
                        <TabPane tab="Create Dispatch" key="2" />
                    </Tabs>
                </div>
                {
                    activeTab === '1' ? <Dispatches />
                        : activeTab === '2' ? <CreateDispatch />
                            : null
                }
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Dispatch