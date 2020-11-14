import { Col, message, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import Spinner from '../../../../components/Spinner';
import NoContent from '../../../../components/NoContent';
import AddressCard from '../../../../components/AddressCard';
import { useParams } from 'react-router-dom';
import { http } from '../../../../modules/http';
import FormModal from '../form-modal';
import { getDevDays, getProductsWithIdForDB, getProductsForUI, isEmpty, getDeliveryDays, extractDeliveryDetails, extractProductsFromForm } from '../../../../utils/Functions';
import { validateDeliveryValues, validateDevDays } from '../../../../utils/validations';

const DeliveryDetails = ({ routeOptions }) => {
    const { accountId } = useParams()
    const [delivery, setDelivery] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [viewModal, setViewModal] = useState(false)
    const [devDays, setDevDays] = useState([])
    const [btnDisabled, setBtnDisabled] = useState(false)

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

    const handleUpdate = async () => {
        const deliveryErrors = validateDeliveryValues(formData)
        const devDaysError = validateDevDays(devDays)

        if (!isEmpty(deliveryErrors) || !isEmpty(devDaysError)) {
            console.log('deliveryErrors', deliveryErrors)
            console.log('devDaysError', devDaysError)
            message.error('Validation Error')
            return
        }

        const productsUI = extractProductsFromForm(formData)
        const products = getProductsWithIdForDB(productsUI)
        const deliveryDays = getDeliveryDays(devDays)
        const formValues = extractDeliveryDetails(formData)
        const body = { ...formValues, isNew: false, delete: 0, isActive: 0, products, deliveryDays }

        const url = '/customer/updateDeliveryDetails'
        try {
            setBtnDisabled(true)
            message.loading('Updating details...', 0)
            await http.POST(url, body)
            message.success('Details updated successfully!')
            setViewModal(false)
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

    const handleClick = useCallback((data) => {
        const { location, products, deliveryDays } = data
        const devDays = getDevDays(deliveryDays)
        const productsUI = getProductsForUI(products)
        setDevDays(devDays)
        setFormData({ ...data, deliveryLocation: location, ...productsUI })
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
                        )) : <NoContent content='No Delivery Details To display' />
                }
            </Row>
            <FormModal
                data={formData}
                devDays={devDays}
                visible={viewModal}
                btnDisabled={btnDisabled}
                routeOptions={routeOptions}
                onCancel={handleModalCancel}
                onSelect={handleDevDaysSelect}
                onChange={handleChange}
                onDeselect={handleDevDaysDeselect}
                onOk={handleUpdate}
                title={`Delivery Details - ${formData.location}`}
                btnTxt={formData.isActive ? 'Close' : 'Update'}
            />
        </div>
    )
}
export default DeliveryDetails
