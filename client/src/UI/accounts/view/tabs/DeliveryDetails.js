import { Col, message, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import Spinner from '../../../../components/Spinner';
import NoContent from '../../../../components/NoContent';
import AddressCard from '../../../../components/AddressCard';
import { useParams } from 'react-router-dom';
import { http } from '../../../../modules/http';
import { getDevDays, getProductsWithIdForDB, getProductsForUI, isEmpty, extractDeliveryDetails, extractProductsFromForm, deepClone, getBase64, getDevDaysForDB, base64String } from '../../../../utils/Functions';
import { validateDeliveryValues, validateDevDays } from '../../../../utils/validations';
import DeliveryForm from '../../add/forms/Delivery';
import CustomModal from '../../../../components/CustomModal';
import { WEEKDAYS } from '../../../../assets/fixtures';

const DeliveryDetails = ({ routeOptions, recentDelivery }) => {
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

    useEffect(() => {
        if (!isEmpty(recentDelivery)) {
            const clone = [recentDelivery, ...delivery]
            setDelivery(clone)
        }
    }, [recentDelivery])

    const getDeliveryDetails = async () => {
        const url = `/customer/getCustomerDeliveryDetails/${accountId}`
        try {
            const { data: [data] } = await http.GET(url)
            const { deliveryDetails } = data
            setDelivery(deliveryDetails)
            setLoading(false)
        } catch (error) { }
    }
    const updateDeliveryDetails = (data) => {
        let clone = deepClone(delivery);
        const item = clone.find(item => item.deliveryDetailsId == data.deliveryDetailsId)
        const index = clone.indexOf(item)
        clone[index] = data;
        setDelivery(clone)
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
        const deliveryDays = getDevDaysForDB(devDays.shift())
        const formValues = extractDeliveryDetails(formData)
        const body = [{ ...formValues, isNew: false, delete: 0, isActive: 0, products, deliveryDays }]

        const url = '/customer/updateDeliveryDetails'
        try {
            setBtnDisabled(true)
            message.loading('Updating details...', 0)
            const { data: [data] } = await http.POST(url, body)
            updateDeliveryDetails(data)
            message.success('Details updated successfully!')
            setViewModal(false)
            setBtnDisabled(false)
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const handleDevDaysSelect = (value) => {
        if (value == 'ALL') setDevDays(WEEKDAYS)
        else {
            const clone = [...devDays]
            clone.push(value)
            setDevDays(clone)
        }
    }

    const handleDevDaysDeselect = (value) => {
        const filtered = devDays.filter(day => day !== value && day !== "ALL")
        setDevDays(filtered)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
    }

    const handleProofUpload = (file, name) => {
        getBase64(file, async (buffer) => {
            setFormData(data => ({ ...data, [name]: buffer }))
        })
    }
    const handleProofRemove = (name) => {
        setFormData(data => ({ ...data, [name]: '' }))
    }

    const handleClick = useCallback((data) => {
        const { location, products, deliveryDays, gstProof } = data
        const gst = base64String(gstProof?.data)
        const devDays = getDevDays(deliveryDays)
        const productsUI = getProductsForUI(products)
        setDevDays(devDays)
        setFormData({ ...data, gstProof: gst, deliveryLocation: location, ...productsUI })
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
                        )) : <NoContent content='No delivery details to show' />
                }
            </Row>
            <CustomModal
                className='delivery-form-modal'
                visible={viewModal}
                btnDisabled={btnDisabled}
                onOk={handleUpdate}
                onCancel={handleModalCancel}
                title={`Delivery Details - ${formData.location}`}
                okTxt={formData.isActive ? 'Close' : 'Update'}
            >
                <DeliveryForm
                    data={formData}
                    routeOptions={routeOptions}
                    hasExtraAddress
                    devDays={devDays}
                    onChange={handleChange}
                    onUpload={handleProofUpload}
                    onRemove={handleProofRemove}
                    onSelect={handleDevDaysSelect}
                    onDeselect={handleDevDaysDeselect}
                />
            </CustomModal>
        </div>
    )
}
export default DeliveryDetails
