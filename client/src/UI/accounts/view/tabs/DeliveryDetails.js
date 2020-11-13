import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Spinner from '../../../../components/Spinner';
import NoContent from '../../../../components/NoContent';
import AddressCard from '../../../../components/AddressCard';
import { useParams } from 'react-router-dom';
import { http } from '../../../../modules/http';
import FormModal from '../form-modal';
import { getDevDays, getProductsForUI } from '../../../../utils/Functions';

const DeliveryDetails = ({ routeOptions }) => {
    const { accountId } = useParams()
    const [delivery, setDelivery] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [viewModal, setViewModal] = useState(false)
    const [devDays, setDevDays] = useState([])


    useEffect(() => {
        getDeliveryDetails()
    }, [])

    const getDeliveryDetails = async () => {
        const url = `/customer/getCustomerDeliveryDetails/${accountId}`
        try {
            const { data: [data] } = await http.GET(url)
            const { deliveryDetails } = data
            setDelivery(deliveryDetails)
            setLoading(false)
        } catch (error) { }
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

    const handleClick = useCallback((data) => {
        const { location, customerproducts } = data
        const devDays = getDevDays(JSON.parse(data['Delivery Days']))
        const products = getProductsForUI(customerproducts)
        setDevDays(devDays)
        setFormData({ ...data, deliveryLocation: location, ...products })
        setViewModal(true)
    }, [])

    const handleModalCancel = useCallback(() => setViewModal(false), [])

    return (
        <div className='account-view-delivery-details'>
            <Row gutter={[{ lg: 32, xl: 16 }, { lg: 32, xl: 32 }]}>
                {
                    loading ? <NoContent content={<Spinner />} />
                        : delivery.length ? delivery.map((item) => (
                            <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={item.deliveryDetailsId}>
                                <AddressCard data={item} onClick={handleClick} />
                            </Col>
                        )) : <NoContent content='No Accounts To display' />
                }
            </Row>
            <FormModal
                data={formData}
                devDays={devDays}
                visible={viewModal}
                routeOptions={routeOptions}
                onOk={handleModalCancel}
                onCancel={handleModalCancel}
                onSelect={handleDevDaysSelect}
                onChange={handleChange}
                onDeselect={handleDevDaysDeselect}
                title={`Delivery Address - ${formData.location}`}
                btnTxt={formData.isActive ? 'Close' : 'Update'}
            />
        </div>
    )
}
export default DeliveryDetails
