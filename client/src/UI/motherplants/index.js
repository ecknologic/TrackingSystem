import { Tabs } from 'antd';
import React, { Fragment } from 'react';
import Header from './header';

const Motherplants = () => {

    return (
        <Fragment>
            <Header />
            <div className='materials-content'>
                <div className='app-tabs-container'>
                    <Tabs>
                        <TabPane tab="Mother Plants" key="1">
                        </TabPane>
                        <TabPane tab="Create New Plant" key="2">
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Motherplants