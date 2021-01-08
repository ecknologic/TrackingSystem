import { Col, message, Row } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../../../../modules/http';
import DeliveryForm from '../../add/forms/Delivery';
import Spinner from '../../../../components/Spinner';
import { TRACKFORM } from '../../../../utils/constants';
import NoContent from '../../../../components/NoContent';
import QuitModal from '../../../../components/CustomModal';
import CustomModal from '../../../../components/CustomModal';
import AddressCard from '../../../../components/AddressCard';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { getRouteOptions, WEEKDAYS } from '../../../../assets/fixtures';
import { getDevDays, getProductsWithIdForDB, getProductsForUI, isEmpty, extractDeliveryDetails, extractProductsFromForm, deepClone, getBase64, getDevDaysForDB, base64String, resetTrackForm, showToast } from '../../../../utils/Functions';
import { validateDeliveryValues, validateDevDays, validateIDNumbers, validateMobileNumber, validateNames, validateNumber } from '../../../../utils/validations';

const DeliveryDetails = ({ recentDelivery, ...rest }) => {
    const { accountId } = useParams()
    const [delivery, setDelivery] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [viewModal, setViewModal] = useState(false)
    const [devDays, setDevDays] = useState([])
    const [routeList, setRouteList] = useState([])
    const [currentDepId, setCurrentDepId] = useState('')
    const [devDaysError, setDevDaysError] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)

    const routeOptions = useMemo(() => getRouteOptions(routeList), [routeList])


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
            const { data: [data = {}] } = await http.GET(url)
            const { deliveryDetails } = data
            setDelivery(deliveryDetails)
            setLoading(false)
        } catch (error) { }
    }

    const getRouteList = async (departmentId) => {
        const data = await http.GET(`/customer/getRoutes/${departmentId}`)
        setRouteList(data)
        setCurrentDepId(departmentId)
    }

    const optimisticUpdate = (data) => {
        let clone = deepClone(delivery);
        const index = clone.findIndex(item => item.deliveryDetailsId === data.deliveryDetailsId)
        clone[index] = data;
        setDelivery(clone)
    }

    const optimisticApprove = (id) => {
        let clone = deepClone(delivery);
        const index = clone.findIndex(item => item.deliveryDetailsId === id)
        clone[index].isApproved = 1;
        setDelivery(clone)
    }

    const handleDevDaysSelect = (value) => {
        setDevDaysError({ devDays: '' })
        if (value == 'ALL') setDevDays(WEEKDAYS)
        else {
            const clone = [...devDays]
            clone.push(value)
            if (clone.length === 7) clone.push('ALL')
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

        if (key === 'departmentId') {
            setFormData(data => ({ ...data, routeId: null }))
            handleGetNewRouteList(value)

        }

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

    const handleGetNewRouteList = (depId) => {
        if (currentDepId !== depId) {
            getRouteList(depId)
        }
    }

    const handleProofRemove = (name) => {
        setFormData(data => ({ ...data, [name]: '' }))
    }

    const handleClick = useCallback((data) => {
        const { location, products, deliveryDays, gstProof, departmentId } = data
        const gst = base64String(gstProof?.data)
        const devDays = getDevDays(deliveryDays)
        const productsUI = getProductsForUI(products)
        setDevDays(devDays)
        handleGetNewRouteList(departmentId)
        setFormData({ ...data, gstProof: gst, deliveryLocation: location, ...productsUI })
        setViewModal(true)
    }, [currentDepId])

    const handleAddressDelete = async (id) => {
        const options = { item: 'Delivery details', v1Ing: 'Deleting', v2: 'deleted' }
        const url = `/customer/deleteDelivery/${id}`

        try {
            showToast({ ...options, action: 'loading' })
            await http.DELETE(url)
            const filtered = delivery.filter(item => item.deliveryDetailsId !== id)
            setDelivery(filtered)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const handleAddressApprove = async (id) => {
        const options = { item: 'Delivery details', v1Ing: 'Approving', v2: 'approved' }
        const url = `/customer/approveDelivery/${id}`

        try {
            showToast({ ...options, action: 'loading' })
            await http.GET(url)
            optimisticApprove(id)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const handleMenuSelect = (key, id) => {
        if (key === 'approve') {
            handleAddressApprove(id)
        }
        else if (key === 'delete') {
            handleAddressDelete(id)
        }
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
        const options = { item: 'Delivery details', v1Ing: 'Updating', v2: 'updated' }
        const url = '/customer/updateDeliveryDetails'
        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            const { data: [data = {}] } = await http.POST(url, body)
            optimisticUpdate(data)
            showToast(options)
            onModalClose(true)
            setBtnDisabled(false)
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const onModalClose = (hasUpdated) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasUpdated) {
            return setConfirmModal(true)
        }
        setViewModal(false)
        setDevDaysError({})
        setFormErrors({})
        resetTrackForm()
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
                                <AddressCard data={item} onClick={handleClick} onSelect={handleMenuSelect} />
                            </Col>
                        )) : <NoContent content='No delivery details to show' />
                }
            </Row>
            <CustomModal
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
                visible={viewModal}
                btnDisabled={btnDisabled}
                onOk={formData.isApproved ? handleModalCancel : handleUpdate}
                onCancel={handleModalCancel}
                title={`Delivery Details - ${formData.location}`}
                okTxt={formData.isApproved ? 'Close' : 'Update'}
            >
                <DeliveryForm
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
                    {...rest}
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
