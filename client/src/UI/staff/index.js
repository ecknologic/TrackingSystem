import { Tabs } from 'antd';
import React, { Fragment } from 'react';
import Header from './header';

const Staff = () => {

    return (
        <Fragment>
            <Header />
            <div className='materials-content'>
                <div className='app-tabs-container'>
                    <Tabs>
                        <TabPane tab="Staff" key="1">
                        </TabPane>
                        <TabPane tab="Create New Employee" key="2">
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Staff