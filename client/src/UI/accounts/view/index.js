import { Tabs } from 'antd';
import React, { Fragment } from 'react';
import { FileTextOutlined } from '@ant-design/icons'
import CustomButton from '../../../components/CustomButton';
import DeliveryDetails from './tabs/DeliveryDetails';
import CorporateAccount from '../add/forms/CorporateAccount';
import Header from './header';

const { TabPane } = Tabs;

const ViewAccount = () => {

    const handleAdd = () => { }
    const handleChange = () => { }

    return (
        <Fragment>
            <Header />
            <div className='account-view-content'>
                <div className='tabs-container'>
                    <Tabs
                        tabBarGutter={40}
                        tabBarExtraContent={
                            <CustomButton
                                className='extra-btn'
                                onClick={handleAdd}
                                icon={<FileTextOutlined />}
                                text='Add new Delivery address' />
                        }
                    >
                        <TabPane tab="Account Overview" key="1">
                            <CorporateAccount onChange={handleChange} />
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
