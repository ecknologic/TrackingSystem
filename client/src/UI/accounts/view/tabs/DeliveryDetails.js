import axios from 'axios';
import { Col, Empty, message, Row } from 'antd';
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
import DeleteModal from '../../../../components/CustomModal';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { getRouteOptions, WEEKDAYS } from '../../../../assets/fixtures';
import { validateDeliveryValues, validateMultiOptions, validateIntFloat, validateMobileNumber, validateNames, validateNumber } from '../../../../utils/validations';
import { getDevDays, getProductsWithIdForDB, getProductsForUI, isEmpty, extractDeliveryDetails, extractProductsFromForm, deepClone, getBase64, getDevDaysForDB, base64String, resetTrackForm, showToast, getLabel } from '../../../../utils/Functions';

const DeliveryDetails = ({ isAdmin, recentDelivery, onUpdate, ...rest }) => {
    const { accountId } = useParams()
    const [delivery, setDelivery] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [viewModal, setViewModal] = useState(false)
    const [_devDays, _setDevDays] = useState([])
    const [devDays, setDevDays] = useState([])
    const [routeList, setRouteList] = useState([])
    const [currentDepId, setCurrentDepId] = useState('')
    const [devDaysError, setDevDaysError] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [exitMsg, setExitMsg] = useState('')
    const [currentAction, setCurrentAction] = useState('')
    const [viewedArr, setViewedArr] = useState([])
    const [currentId, setCurrentId] = useState('')
    const [shake, setShake] = useState(false)

    const routeOptions = useMemo(() => getRouteOptions(routeList), [routeList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getDeliveryDetails()

        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        if (!isEmpty(recentDelivery)) {
            const clone = [recentDelivery, ...delivery]
            setDelivery(clone)
        }
    }, [recentDelivery])

    const getDeliveryDetails = async () => {
        const url = `customer/getCustomerDeliveryDetails/${accountId}`
        try {
            const { data: [data = {}] } = await http.GET(axios, url, config)
            const { deliveryDetails } = data
            setDelivery(deliveryDetails)
            setLoading(false)
        } catch (error) { }
    }

    const fetchDelivery = async (id) => {
        const url = `customer/getDeliveryDetails/${id}`

        try {
            showToast({ v1Ing: 'Fetching', action: 'loading' })
            let { data: [data] } = await http.GET(axios, url, config)
            const { location, products, deliveryDays, gstProof, departmentId } = data
            const gst = base64String(gstProof?.data)
            const devDays = getDevDays(deliveryDays)
            const productsUI = getProductsForUI(products)
            const formData = { ...data, gstProof: gst, deliveryLocation: location, ...productsUI }
            _setDevDays(devDays)
            setDevDays(devDays)
            handleGetNewRouteList(departmentId)
            setFormData(formData)
            setViewedArr([...viewedArr, formData])
            setViewModal(true)
            message.destroy()
        } catch (error) {
            message.destroy()
        }
    }

    const getRouteList = async (departmentId) => {
        const url = `customer/getRoutes/${departmentId}`

        try {
            const data = await http.GET(axios, url, config)
            setRouteList(data)
            setCurrentDepId(departmentId)
        } catch (error) { }
    }

    const handleAccountClose = async (id) => {
        const options = { item: 'Delivery', v1Ing: 'Closing', v2: 'closed' }
        const hasMD = delivery.filter(item => item.isClosed == 0).length > 1
        const url = `customer/closeCustomerdelivery/${id}?hasMultipleDeliveries=${hasMD}&customerId=${accountId}`
        try {
            showToast({ ...options, action: 'loading' })
            await http.GET(axios, url, config)
            optimisticUpdate(id, 1, 'isClosed')
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const optimisticDataUpdate = (data) => {
        let clone = deepClone(delivery);
        const index = clone.findIndex(item => item.deliveryDetailsId === data.deliveryDetailsId)
        clone[index] = data;
        setDelivery(clone)
    }

    const optimisticUpdate = (id, value, key) => {
        let clone = deepClone(delivery);
        const index = clone.findIndex(item => item.deliveryDetailsId === id)
        clone[index][key] = value;
        setDelivery(clone)
    }

    const optimisticDelete = (id) => {
        const filtered = delivery.filter(item => item.deliveryDetailsId !== id)
        setDelivery(filtered)
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

    const handleChange = (value, key, label, labelKey) => {
        setFormData(data => ({ ...data, [key]: value, ...getLabel(labelKey, label) }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'departmentId') {
            setFormData(data => ({ ...data, routeId: null }))
            handleGetNewRouteList(value)

        }

        // Validations
        if (key === 'phoneNumber') {
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
        else if (key.includes('product')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value, true)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
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

    const handleClick = async (id) => {
        const delivery = viewedArr.find(item => item.deliveryDetailsId === id)

        if (delivery) {
            const { departmentId } = delivery
            handleGetNewRouteList(departmentId)
            setFormData(delivery)
            setViewModal(true)
        }
        else fetchDelivery(id)
    }

    const handleMenuSelect = (key, id) => {
        setCurrentId(id)
        setCurrentAction(key)

        if (key === 'Active') {
            handleStatusUpdate(id, 1)
        }
        else if (key === 'Draft') {
            handleStatusUpdate(id, 0)
        }
        else if (key === 'Delete') {
            setExitMsg('Are you sure you want to delete?')
            setModalDelete(true)
        }
        else if (key === 'Close') {
            setExitMsg('Are you sure you want to close?')
            setModalDelete(true)
        }
    }

    const handleStatusUpdate = async (id, status) => {
        const { departmentId, location } = delivery
        const options = { item: 'Delivery status', v1Ing: 'Updating', v2: 'updated' }
        const url = `customer/updateDeliveryDetailsStatus`
        const body = { status, deliveryDetailsId: id, departmentId, location }

        try {
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            optimisticUpdate(id, status, 'status')
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const handleDelete = async (id) => {
        const options = { item: 'Delivery details', v1Ing: 'Deleting', v2: 'deleted' }
        const url = `customer/deleteDelivery/${id}`

        try {
            showToast({ ...options, action: 'loading' })
            await http.DELETE(axios, url, config)
            optimisticDelete(id)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const handleUpdate = async () => {
        const deliveryErrors = validateDeliveryValues(formData)
        const devDaysError = validateMultiOptions(devDays)

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
        const isDeliveryDaysUpdated = _devDays.length !== devDays.length
        const body = [{ ...formValues, isNew: false, delete: 0, products, deliveryDays, isDeliveryDaysUpdated }]
        const options = { item: 'Delivery details', v1Ing: 'Updating', v2: 'updated' }
        const url = 'customer/updateDeliveryDetails'
        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            const { data: [data = {}] } = await http.POST(axios, url, body, config)
            optimisticDataUpdate(data)
            showToast(options)
            onModalClose(true)
            setBtnDisabled(false)
            setViewedArr([])
            onUpdate()
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
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
    const handleDeleteModalOk = useCallback(() => {
        setModalDelete(false);
        if (currentAction === 'Close')
            handleAccountClose(currentId)
        else
            handleDelete(currentId)
    }, [currentId])

    const handleDeleteModalCancel = useCallback(() => {
        setModalDelete(false)
    }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleModalCancel = useCallback(() => onModalClose(), [])
    const canView = !isAdmin && formData.isApproved

    return (
        <div className='account-view-delivery-details'>
            <Row gutter={[{ lg: 32, xl: 16 }, { lg: 16, xl: 16 }]}>
                {
                    loading ? <NoContent content={<Spinner />} />
                        : delivery.length ? delivery.map((item) => (
                            <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={item.deliveryDetailsId}>
                                <AddressCard data={item} isAdmin={isAdmin} onClick={handleClick} onSelect={handleMenuSelect} />
                            </Col>
                        )) : <NoContent content={<Empty />} />
                }
            </Row>
            <CustomModal
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
                visible={viewModal}
                btnDisabled={btnDisabled}
                onOk={canView ? handleModalCancel : handleUpdate}
                onCancel={handleModalCancel}
                title={`Delivery Details - ${formData.location}`}
                okTxt={canView ? 'Close' : 'Update'}
            >
                <DeliveryForm
                    data={formData}
                    errors={formErrors}
                    devDays={devDays}
                    isAdmin={isAdmin}
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
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </QuitModal>
            <DeleteModal
                visible={modalDelete}
                onOk={handleDeleteModalOk}
                onCancel={handleDeleteModalCancel}
                title={exitMsg}
                okTxt='Yes'
            >
                <ConfirmMessage msg='This action cannot be undone.' />
            </DeleteModal>
        </div>
    )
}
export default DeliveryDetails
