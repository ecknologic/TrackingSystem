import { Tabs } from 'antd';
import React, { Fragment } from 'react';
import SecondaryButton from '../../../components/SecondaryButton';
import Header from './header';
import DeliveryDetails from './tabs/DeliveryDetails';

const { TabPane } = Tabs;


const ViewAccount = () => {

    const handleAdd = () => { }

    return (
        <Fragment>
            <Header />
            <div className='account-view-content'>
                <div className='tabs-container'>
                    <Tabs
                        tabBarGutter={40}
                        tabBarExtraContent={<SecondaryButton onClick={handleAdd} text='Add new Delivery address' />}
                    >
                        <TabPane tab="Account Overview" key="1">
                            Content of tab 1
                        </TabPane>
                        <TabPane tab="Delivery Details" key="2">
                            <DeliveryDetails />
                        </TabPane>
                        <TabPane tab="Invoice" key="3">
                            Content of tab 3
                        </TabPane>
                        <TabPane tab="Report Log" key="4">
                            Content of tab 3
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}
export default ViewAccount
