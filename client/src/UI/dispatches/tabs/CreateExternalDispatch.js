import { Radio } from 'antd';
import React, { useState, useCallback } from 'react';
import CustomButton from '../../../components/CustomButton';
import FormHeader from '../../../components/FormHeader';
import ExternalDispatchForm from '../forms/ExternalDispatchForm';
import ConfirmModal from '../../../components/CustomModal';
import { resetTrackForm } from '../../../utils/Functions';
import { TRACKFORM } from '../../../utils/constants';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { validateMobileNumber, validateNames, validateNumber } from '../../../utils/validations';
import InputLabel from '../../../components/InputLabel';

const CreateExternalDispatch = () => {
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
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
        if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBatchCreate = () => {

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
            <ExternalDispatchForm
                track
                data={formData}
                errors={formErrors}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <div className='input-container'>
                <InputLabel name='Select Payment Mode' mandatory />
                <Radio.Group size='large' options={plainOptions} onChange={() => { }} />
            </div>
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleBatchCreate}
                    className={`
                    app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Create DC'
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
const plainOptions = ['Add Debit/Credit/ATM Card', 'Add Net Banking', 'Pay on Delivery (Cash/UPI/Card)'];
export default CreateExternalDispatch