import { message } from 'antd';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { http } from '../../../modules/http';
import { TRACKFORM } from '../../../utils/constants';
import CreateNewWHForm from '../../motherplant/forms/CreateNewPlant';
import ConfirmModal from '../../../components/CustomModal';
import { getStaffOptions } from '../../../assets/fixtures';
import CustomButton from '../../../components/CustomButton';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { getBase64, getMPValuesForDB, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { validateIDNumbers, validateMobileNumber, validateNames, validateMPValues, validatePinCode } from '../../../utils/validations';

const CreateNewWarehouse = ({ goToTab }) => {
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [staffList, setStaffList] = useState([])
    const [shake, setShake] = useState(false)
    const [admin, setAdmin] = useState({})

    const staffOptions = useMemo(() => getStaffOptions(staffList), [staffList])

    useEffect(() => {
        getStaffList()
    }, [])

    const getStaffList = async () => {
        const data = await http.GET(`/users/getUsersBydepartmentType/MotherPlant`)
        setStaffList(data)
    }


    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'adminId') {
            const admin = staffList.find(staff => staff.userId === value)
            setAdmin(admin)
        }

        // Validations
        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'departmentName' || key === 'city' || key === 'state') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'pinCode') {
            const error = validatePinCode(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations

        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'pinCode') {
            const error = validatePinCode(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleUpload = (file) => {
        getBase64(file, async (buffer) => {
            setFormData(data => ({ ...data, gstProof: buffer }))
            setFormErrors(errors => ({ ...errors, gstProof: '' }))
        })
    }

    const handleRemove = () => setFormData(data => ({ ...data, gstProof: '' }))

    const handleSubmit = async () => {
        const formErrors = validateMPValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const motherplant = getMPValuesForDB(formData)
        let body = {
            ...motherplant
        }
        const url = '/motherplant/createMotherPlant'
        const options = { item: 'Mother Plant', v1Ing: 'Adding', v2: 'added' }


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
        setFormData({})
        setAdmin({})
        setFormErrors({})
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
            <CreateNewWHForm
                data={formData}
                admin={admin}
                errors={formErrors}
                onBlur={handleBlur}
                onChange={handleChange}
                onUpload={handleUpload}
                onRemove={handleRemove}
                staffOptions={staffOptions}
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

export default CreateNewWarehouse