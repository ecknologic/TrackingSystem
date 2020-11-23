import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import Spinner from '../../../../components/Spinner';
import NoContent from '../../../../components/NoContent';
import AddressCard from '../../../../components/AddressCard';
import { useParams } from 'react-router-dom';
import { http } from '../../../../modules/http';
import { getDevDays, getProductsWithIdForDB, getProductsForUI, isEmpty, extractDeliveryDetails, extractProductsFromForm, deepClone, getBase64, getDevDaysForDB, base64String, resetTrackForm, showToast } from '../../../../utils/Functions';
import { validateDeliveryValues, validateDevDays, validateIDNumbers, validateMobileNumber, validateNames, validateNumber } from '../../../../utils/validations';
import DeliveryForm from '../../add/forms/Delivery';
import CustomModal from '../../../../components/CustomModal';
import { WEEKDAYS } from '../../../../assets/fixtures';
import { TRACKFORM } from '../../../../utils/constants';
import QuitModal from '../../../../components/CustomModal';
import ConfirmMessage from '../../../../components/ConfirmMessage';

const DeliveryDetails = ({ routeOptions, recentDelivery }) => {
    const { accountId } = useParams()
    const [delivery, setDelivery] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [viewModal, setViewModal] = useState(false)
    const [devDays, setDevDays] = useState([])
    const [devDaysError, setDevDaysError] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)

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
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(deliveryErrors)
            setDevDaysError(devDaysError)
            return
        }

        const productsUI = extractProductsFromForm(formData)
        const products = getProductsWithIdForDB(productsUI)
        const deliveryDays = getDevDaysForDB(devDays)
        const formValues = extractDeliveryDetails(formData)
        const body = [{ ...formValues, isNew: false, delete: 0, isActive: 0, products, deliveryDays }]

        const url = '/customer/updateDeliveryDetails'
        try {
            setBtnDisabled(true)
            showToast('Delivery details', 'loading', 'PUT')
            const { data: [data] } = await http.POST(url, body)
            updateDeliveryDetails(data)
            showToast('Delivery details', 'success', 'PUT')
            onModalClose(true)
            setBtnDisabled(false)
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const handleDevDaysSelect = (value) => {
        setDevDaysError({ devDays: '' })
        if (value == 'ALL') setDevDays(WEEKDAYS)
        else {
            const clone = [...devDays]
            clone.push(value)
            setDevDays(clone)
        }
    }

    const handleDevDaysDeselect = (value) => {
        if (value == 'ALL') setDevDays([])
        else {
            const filtered = devDays.filter(day => day !== value && day !== "ALL")
            setDevDays(filtered)
        }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        if (key === 'deliveryLocation') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'depositAmount') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'contactPerson') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('price') || key.includes('product')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleProofUpload = (file, name) => {
        getBase64(file, async (buffer) => {
            setFormData(data => ({ ...data, [name]: buffer }))
            setFormErrors(errors => ({ ...errors, [name]: '' }))
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

    const onModalClose = (hasUpdated) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasUpdated) {
            return setConfirmModal(true)
        }
        setViewModal(false)
        setDevDaysError({})
        setFormErrors({})
    }

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleModalCancel = useCallback(() => onModalClose(), [])

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
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
                visible={viewModal}
                btnDisabled={btnDisabled}
                onOk={handleUpdate}
                onCancel={handleModalCancel}
                title={`Delivery Details - ${formData.location}`}
                okTxt={formData.isActive ? 'Close' : 'Update'}
                track
            >
                <DeliveryForm
                    track
                    data={formData}
                    errors={formErrors}
                    devDays={devDays}
                    devDaysError={devDaysError}
                    routeOptions={routeOptions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onUpload={handleProofUpload}
                    onRemove={handleProofRemove}
                    onSelect={handleDevDaysSelect}
                    onDeselect={handleDevDaysDeselect}
                />
            </CustomModal>
            <QuitModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </QuitModal>
        </div>
    )
}
export default DeliveryDetails
