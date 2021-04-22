import axios from 'axios';
import { message } from 'antd';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { http } from '../../../modules/http';
import DispatchForm from '../forms/Dispatch';
import { TRACKFORM } from '../../../utils/constants';
import FormHeader from '../../../components/FormHeader';
import ConfirmModal from '../../../components/CustomModal';
import CustomButton from '../../../components/CustomButton';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { getDistributorOptions } from '../../../assets/fixtures';
import { extractValidProductsForDB, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { compareDispatchValues, validateDispatchValues, validateMobileNumber, validateNames, validateNumber } from '../../../utils/validations';

const CreateDispatch = ({ goToTab, driverList, warehouseList, reFetch, ...rest }) => {
    const defaultValue = { dispatchType: 'warehouse' }
    const [formData, setFormData] = useState(defaultValue)
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [currentStock, setCurrentStock] = useState({})
    const [distributorList, setDistributorList] = useState([])
    const [shake, setShake] = useState(false)

    const distributorOptions = useMemo(() => getDistributorOptions(distributorList), [distributorList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    const getCurrentStock = async (batchId) => {

        const url = `motherPlant/getProductByBatch/${batchId}`

        try {
            const data = await http.GET(axios, url, config)
            const { product20LCount: product20L, product2LCount: product2L, product1LCount: product1L,
                product500MLCount: product500ML, product300MLCount: product300ML } = data
            const currentStock = { product20L, product2L, product1L, product500ML, product300ML }
            setCurrentStock(data)
            setFormData(data => ({ ...data, ...currentStock }))
        } catch (error) { }
    }

    const getDistributorList = async () => {
        const url = 'distributor/getDistributorsList'

        try {
            const data = await http.GET(axios, url, config)
            setDistributorList(data)
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'batchId') getCurrentStock(value)
        if (key === 'dispatchType') {
            setFormData(data => ({ ...data, dispatchTo: null }))
            if (value === 'distributor' && isEmpty(distributorList)) {
                // getDistributorList()
            }
        }

        // Validations
        if (key === 'driverId') {
            let selectedDriver = driverList.find(driver => driver.driverId === Number(value))
            let { driverName = null, mobileNumber = null } = selectedDriver || {}
            setFormData(data => ({ ...data, driverName, mobileNumber }))
            setFormErrors(errors => ({ ...errors, mobileNumber: '' }))
        }
        else if (key === 'managerName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('product')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, products: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'mobileNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSubmit = async () => {
        const { dispatchType } = formData
        const formErrors = validateDispatchValues(formData, currentStock)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let departmentName = ''
        if (dispatchType === 'warehouse') departmentName = warehouseList.find(dep => dep.departmentId === formData.dispatchTo).departmentName
        else departmentName = distributorList.find(dep => dep.distributorId === formData.dispatchTo).agencyName

        const { product20L, product2L, product1L, product500ML, product300ML } = extractValidProductsForDB(formData)
        const outOfStock = compareDispatchValues(formData, currentStock)
        let body = {
            ...formData, dispatchAddress: departmentName, outOfStock,
            product20L, product2L, product1L, product500ML, product300ML
        }
        const options = { item: 'Dispatch', v1Ing: 'Creating', v2: 'created' }
        const url = 'motherplant/addDispatchDetails'

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            goToTab('1')
            outOfStock && reFetch()
            resetForm()
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const resetForm = () => {
        setBtnDisabled(false)
        resetTrackForm()
        setFormData(defaultValue)
        setFormErrors({})
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        setBtnDisabled(false)
        setFormData(defaultValue)
        setFormErrors({})
    }

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])

    return (
        <>
            <FormHeader title='Create Dispatch DC' />
            <DispatchForm
                track
                data={formData}
                errors={formErrors}
                onChange={handleChange}
                onBlur={handleBlur}
                distributorOptions={distributorOptions}
                {...rest}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    disabled={btnDisabled}
                    className={`
                    app-create-btn footer-btn
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Add'
                />
            </div>
            <ConfirmModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </>
    )
}

export default CreateDispatch