import axios from 'axios';
import { message } from 'antd';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import CustomButton from '../../../../components/CustomButton';
import FormHeader from '../../../../components/FormHeader';
import MaterialRequestForm from '../forms/MaterialRequest';
import ConfirmModal from '../../../../components/CustomModal';
import { TRACKFORM } from '../../../../utils/constants';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { http } from '../../../../modules/http';
import { isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
import { validateRequestMaterialValues, validateNumber } from '../../../../utils/validations';

const RequestMaterial = ({ goToTab, ...rest }) => {
    const [formData, setFormData] = useState(REQUIREDVALUES)
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key.includes('Level') || key === 'itemQty') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key.includes('Level') || key === 'itemQty') {
            const error = validateNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateRequestMaterialValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const body = { ...formData }
        const url = 'motherPlant/createRM'
        const options = { item: 'Material Request', v1Ing: 'Sending', v2: 'sent' }


        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            goToTab('2')
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
        setFormData({})
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
            <FormHeader title='Raw Material Required' />
            <MaterialRequestForm
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
                    disabled={btnDisabled}
                    className={`
                    app-create-btn footer-btn
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Send Request'
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

const REQUIREDVALUES = {
    itemName: null,
    vendorName: null,
    itemQty: '',
    description: '',
    reorderLevel: '',
    minOrderLevel: ''
}
export default RequestMaterial