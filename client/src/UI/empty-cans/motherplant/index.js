import { Tabs } from 'antd';
import React, { Fragment } from 'react';
import Dashboard from './tabs/Dashboard';
import Header from '../../../components/ContentHeader';
import '../../../sass/products.scss';

const EmptyCans = () => {

    return (
        <Fragment>
            <Header />
            <div className='employee-content'>
                <div className='app-tabs-container'>
                    <Tabs >
                        <TabPane tab="Empty Cans" key="1">
                            <Dashboard />
                        </TabPane>
                    </Tabs>
                </div>
            </div >
        </Fragment >
    )
}
const { TabPane } = Tabs;
export default EmptyCans