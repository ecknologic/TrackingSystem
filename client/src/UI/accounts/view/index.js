import { Tabs } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { FileTextOutlined } from '@ant-design/icons'
import Header from './header';
import CustomButton from '../../../components/CustomButton';
import DeliveryDetails from './tabs/DeliveryDetails';
import CorporateAccount from '../add/forms/CorporateAccount';
import { useParams } from 'react-router-dom';
import { http } from '../../../modules/http';
import { deepClone } from '../../../utils/Functions';

const { TabPane } = Tabs;

const ViewAccount = () => {

    const { accountId } = useParams()
    const [corporateValues, setCorporateValues] = useState({})
    const [IDProofs, setIDProofs] = useState({})
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        getAccountDetails()
    }, [])


    const getAccountDetails = async () => {
        const url = `/customer/getCustomerDetailsById/${accountId}`
        try {
            const { data: [data] } = await http.GET(url)
            const { gstProof, idProof_backside, idProof_frontside, isActive } = data

            const newData = { ...data, gstProof: gstProof?.data }

            setIsActive(!!isActive)
            setIDProofs({ Front: idProof_frontside?.data, Back: idProof_backside?.data })
            setCorporateValues(newData)
            const blob = idProof_frontside?.data

            blobToBase64(blob).then((res) => console.log("res", res))
        } catch (error) {

        }
    }

    const blobToBase64 = blob => {
        const reader = new FileReader();
        console.log("hello")
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    };


    const handleAccountUpdate = () => {

    }
    const handleCorporateChange = () => { }
    const handleProofUpload = () => { }

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
                                onClick={() => { }}
                                icon={<FileTextOutlined />}
                                text='Add new Delivery address' />
                        }
                    >
                        <TabPane tab="Account Overview" key="1">
                            <CorporateAccount
                                data={corporateValues}
                                IDProofs={IDProofs}
                                onUpload={handleProofUpload}
                                onChange={handleCorporateChange}
                            />
                            {
                                isActive ? null
                                    : <div className='app-footer-buttons-container'>
                                        <CustomButton
                                            className='app-cancel-btn footer-btn'
                                            text='Cancel'
                                        />
                                        <CustomButton
                                            onClick={handleAccountUpdate}
                                            className='app-create-btn footer-btn'
                                            text='Update Account'
                                        />
                                    </div>
                            }
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
