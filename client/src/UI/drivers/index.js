import { Tabs } from 'antd';
import React, { Fragment } from 'react';
import Header from '../../components/SimpleHeader';

const Drivers = () => {

    return (
        <Fragment>
            <Header title='Drivers' />
            <div className='materials-content'>
                <div className='app-tabs-container'>
                    <Tabs>
                        <TabPane tab="Drivers" key="1">
                        </TabPane>
                        <TabPane tab="Create New Driver" key="2">
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default Drivers