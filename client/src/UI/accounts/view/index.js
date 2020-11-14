import { message, Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import { FileTextOutlined } from '@ant-design/icons';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { getRouteOptions } from '../../../assets/fixtures';
import CustomButton from '../../../components/CustomButton';
import DeliveryDetails from './tabs/DeliveryDetails';
import AccountOverview from './tabs/AccountOverview';
import DeliveryForm from '../add/forms/Delivery';
import { http } from '../../../modules/http';
import Header from './header';
import { validateDeliveryValues, validateDevDays } from '../../../utils/validations';
import { extractDeliveryDetails, getDeliveryDays, getProductsForDB, extractProductsFromForm, isEmpty } from '../../../utils/Functions';
import CustomModal from '../../../components/CustomModal';

const ViewAccount = () => {
    const { accountId } = useParams()
    const [account, setAccount] = useState({ loading: true })
    const [headerContent, setHeaderContent] = useState({ loading: true })
    const [formData, setFormData] = useState({})
    const [viewModal, setViewModal] = useState(false)
    const [devDays, setDevDays] = useState([])
    const [routes, setRoutes] = useState([])
    const [recentDelivery, setRecentDelivery] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const routeOptions = useMemo(() => getRouteOptions(routes), [routes])
    useEffect(() => {
        getAccount()
        getRoutes()
    }, [])

    const getAccount = async () => {
        const url = `/customer/getCustomerDetailsById/${accountId}`
        try {
            const { data: [data] } = await http.GET(url)
            const { customerName, organizationName, Address1 } = data
            setAccount({ ...data, loading: false })
            setHeaderContent({
                title: organizationName || customerName,
                address: Address1, loading: false
            })
        } catch (error) { }
    }

    const getRoutes = async () => {
        try {
            const data = await http.GET('/warehouse/getroutes')
            setRoutes(data)
        } catch (ex) { }
    }

    const handleCreate = async () => {
        const deliveryErrors = validateDeliveryValues(formData)
        const devDaysError = validateDevDays(devDays)

        if (!isEmpty(deliveryErrors) || !isEmpty(devDaysError)) {
            console.log('deliveryErrors', deliveryErrors)
            console.log('devDaysError', devDaysError)
            message.error('Validation Error')
            return
        }

        const productsUI = extractProductsFromForm(formData)
        const products = getProductsForDB(productsUI)
        const deliveryDays = getDeliveryDays(devDays)
        const formValues = extractDeliveryDetails(formData)
        const body = [{ ...formValues, isNew: true, delete: 0, isActive: 0, products, deliveryDays, customer_Id: accountId }]

        const url = '/customer/updateDeliveryDetails'
        try {
            setBtnDisabled(true)
            message.loading('Adding details...', 0)
            let { data: [data] } = await http.POST(url, body)
            setRecentDelivery(data)
            message.success('Details added successfully!')
            onModalClose()
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const handleDevDaysSelect = (value) => {
        const clone = [...devDays]
        clone.push(value)
        setDevDays(clone)
    }

    const handleDevDaysDeselect = (value) => {
        const filtered = devDays.filter(day => day !== value)
        setDevDays(filtered)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
    }

    const handleClick = useCallback(() => {
        setViewModal(true)
    }, [])

    const onModalClose = () => {
        setViewModal(false)
        setBtnDisabled(false)
        setFormData({})
        setDevDays([])
    }

    const handleModalCancel = useCallback(() => onModalClose(), [])

    return (
        <Fragment>
            <Header data={headerContent} />
            <div className='account-view-content'>
                <div className='tabs-container'>
                    <Tabs
                        tabBarGutter={40}
                        tabBarExtraContent={
                            <CustomButton
                                className='extra-btn'
                                onClick={handleClick}
                                icon={<FileTextOutlined />}
                                text='Add new Delivery address' />
                        }
                    >
                        <TabPane tab="Account Overview" key="1">
                            <AccountOverview data={account} />
                        </TabPane>
                        <TabPane tab="Delivery Details" key="2">
                            <DeliveryDetails recentDelivery={recentDelivery} routeOptions={routeOptions} />
                        </TabPane>
                        <TabPane tab="Invoice" key="3">
                            Design in progress...
                        </TabPane>
                        <TabPane tab="Report Log" key="4">
                            Design in progress...
                        </TabPane>
                    </Tabs>
                </div>
            </div>
            <CustomModal
                className='delivery-form-modal'
                visible={viewModal}
                btnDisabled={btnDisabled}
                onOk={handleCreate}
                onCancel={handleModalCancel}
                title='Add New Delivery Address'
                btnTxt='Add New'
            >
                <DeliveryForm
                    data={formData}
                    routeOptions={routeOptions}
                    hasExtraAddress
                    devDays={devDays}
                    onChange={handleChange}
                    onSelect={handleDevDaysSelect}
                    onDeselect={handleDevDaysDeselect}
                />
            </CustomModal>
        </Fragment>
    )
}
const { TabPane } = Tabs;
export default ViewAccount
