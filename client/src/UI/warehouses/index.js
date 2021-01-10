import { Tabs } from 'antd';
import React, { Fragment } from 'react';
import Header from './header';

const Warehouses = () => {

    return (
        <Fragment>
            <Header />
            <div className='materials-content'>
                <div className='app-tabs-container'>
                    <Tabs>
                        <TabPane tab="Warehouses" key="1">
                        </TabPane>
                        <TabPane tab="Create New Warehouse" key="2">
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Warehouses