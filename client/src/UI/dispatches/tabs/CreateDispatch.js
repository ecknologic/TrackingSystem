import { message } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import CustomButton from '../../../components/CustomButton';
import FormHeader from '../../../components/FormHeader';
import DispatchForm from '../forms/Dispatch';
import ConfirmModal from '../../../components/CustomModal';
import { TRACKFORM } from '../../../utils/constants';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { http } from '../../../modules/http';
import { isEmpty, removeFormTracker, resetTrackForm, showToast, trackAccountFormOnce } from '../../../utils/Functions';
import { validateDispatchValues, validateMobileNumber, validateNames, validateNumber } from '../../../utils/validations';

const CreateDispatch = ({ goToTab, driverList, departmentList, ...rest }) => {
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [currentStock, setCurrentStock] = useState({})
    const [shake, setShake] = useState(false)

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            removeFormTracker()
        }
    }, [])

    const getCurrentStock = async (batchId) => {
        const data = await http.GET(`/motherPlant/getProductByBatch/${batchId}`)
        setCurrentStock(data)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'batchId') getCurrentStock(value)

        // Validations
        if (key === 'driverId') {
            let selectedDriver = driverList.find(driver => driver.driverId === Number(value))
            let { driverName = null, mobileNumber = null } = selectedDriver || {}
            setFormData(data => ({ ...data, driverName, mobileNumber }))
            setFormErrors(errors => ({ ...errors, mobileNumber: '' }))
        }
        if (key === 'managerName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        if (key === 'managerName') {
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
        const formErrors = validateDispatchValues(formData, currentStock)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let { departmentName: dispatchAddress } = departmentList.find(dep => dep.departmentId === formData.dispatchTo)

        let body = { ...formData, dispatchType: 'Internal', dispatchAddress }
        const url = '/motherplant/addDispatchDetails'

        try {
            setBtnDisabled(true)
            showToast('Dispatch', 'loading')
            await http.POST(url, body)
            message.destroy()
            goToTab('1')
            showToast('Dispatch', 'success')
        } catch (error) {
            message.destroy()
            setBtnDisabled(false)
        }
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        setBtnDisabled(false)
        setFormData({})
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