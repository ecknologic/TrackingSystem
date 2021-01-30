import { message } from 'antd';
import React, { useState, useCallback, useMemo } from 'react';
import { http } from '../../../modules/http';
import DispatchForm from '../forms/Dispatch';
import { TRACKFORM } from '../../../utils/constants';
import FormHeader from '../../../components/FormHeader';
import ConfirmModal from '../../../components/CustomModal';
import CustomButton from '../../../components/CustomButton';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { getDistributorOptions } from '../../../assets/fixtures';
import { extractValidProductsForDB, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { validateDispatchValues, validateMobileNumber, validateNames, validateNumber } from '../../../utils/validations';

const CreateDispatch = ({ goToTab, driverList, warehouseList, ...rest }) => {
    const defaultValue = { dispatchType: 'warehouse' }
    const [formData, setFormData] = useState(defaultValue)
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [currentStock, setCurrentStock] = useState({})
    const [distributorList, setDistributorList] = useState([])
    const [shake, setShake] = useState(false)

    const distributorOptions = useMemo(() => getDistributorOptions(distributorList), [distributorList])

    const getCurrentStock = async (batchId) => {
        const data = await http.GET(`/motherPlant/getProductByBatch/${batchId}`)
        const { product20LCount: product20L, product1LCount: product1L,
            product500MLCount: product500ML, product250MLCount: product250ML } = data
        const currentStock = { product20L, product1L, product500ML, product250ML }
        setCurrentStock(data)
        setFormData(data => ({ ...data, ...currentStock }))
    }

    const getDistributorList = async () => {
        const data = await http.GET('/distributor/getDistributorsList')
        setDistributorList(data)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'batchId') getCurrentStock(value)
        if (key === 'dispatchType') {
            setFormData(data => ({ ...data, dispatchTo: null }))
            if (value === 'distributor' && !distributorList.length) {
                getDistributorList()
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

        const { product20L, product1L, product500ML, product250ML } = extractValidProductsForDB(formData)
        let body = {
            ...formData, dispatchAddress: departmentName,
            product20L, product1L, product500ML, product250ML
        }
        const options = { item: 'Dispatch', v1Ing: 'Creating', v2: 'created' }
        const url = '/motherplant/addDispatchDetails'

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(url, body)
            showToast(options)
            goToTab('1')
            resetForm()
        } catch (error) {
            message.destroy()
            setBtnDisabled(false)
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
                    className={`
                    app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Create'
                />
            </div>
            <ConfirmModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </>
    )
}

export default CreateDispatch