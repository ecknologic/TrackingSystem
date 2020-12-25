import React, { useCallback, useEffect, useState } from 'react';
import InternalQCForm from '../forms/InternalQC';
import { http } from '../../../../modules/http';
import CustomButton from '../../../../components/CustomButton';
import FormHeader from '../../../../components/FormHeader';
import ConfirmModal from '../../../../components/CustomModal';
import { getUserId } from '../../../../utils/constants';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { shiftOptions } from '../../../../assets/fixtures';
import { isEmpty, removeFormTracker, resetTrackForm, showToast, trackAccountFormOnce } from '../../../../utils/Functions';
import { validateQCValues, validateIntFloat, validateNames } from '../../../../utils/validations';

const InternalQC = () => {
    const USERID = getUserId()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            removeFormTracker()
        }
    }, [])


    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'managerName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phLevel' || key === 'ozoneLevel' || key === 'TDS') {
            const error = validateIntFloat(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'phLevel' || key === 'ozoneLevel' || key === 'TDS') {
            const error = validateIntFloat(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateQCValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const url = '/motherPlant/createProductionQC'
        const body = {
            ...formData
        }

        try {
            setBtnDisabled(true)
            showToast('Quality Control', 'loading')
            await http.POST(url, body)
            resetForm()
            showToast('Quality Control', 'success')
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const resetForm = () => {
        setBtnDisabled(false)
        resetTrackForm()
        setFormData({})
        setFormErrors({})
    }

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        resetForm()
    }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])

    return (
        <>
            <FormHeader title='Create Request Quality Control (Internal)' />
            <InternalQCForm
                track
                data={formData}
                errors={formErrors}
                shiftOptions={shiftOptions}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    className={`
                        app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                        ${shake ? 'app-shake' : ''}
                    `}
                    text='Send'
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

export default InternalQC