import React, { useCallback, useEffect, useState } from 'react';
import BatchForm from '../forms/BatchForm';
import { http } from '../../../../modules/http';
import CASMPPanel from '../../../../components/CASMPPanel';
import CustomButton from '../../../../components/CustomButton';
import FormHeader from '../../../../components/FormHeader';
import ConfirmModal from '../../../../components/CustomModal';
import { getUserId } from '../../../../utils/constants';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { isEmpty, removeFormTracker, resetTrackForm, showToast, trackAccountFormOnce } from '../../../../utils/Functions';
import { validateBatchValues, validateNames, validateNumber } from '../../../../utils/validations';

const StockDetails = ({ date }) => {
    const USERID = getUserId()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [shiftType, setShiftType] = useState('morning')
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()
        resetForm()

        return () => {
            removeFormTracker()
        }
    }, [date])

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'managerName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phLevel' || key === 'ozoneLevel' || key === 'TDS') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('product')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, products: error }))
        }
    }

    const handleBatchCreate = async () => {
        const batchErrors = validateBatchValues(formData)

        if (!isEmpty(batchErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(batchErrors)
            return
        }

        const url = '/motherPlant/addProductionDetails'
        const body = {
            ...formData, shiftType, createdBy: USERID
        }
        try {
            setBtnDisabled(true)
            showToast('Batch', 'loading')
            await http.POST(url, body)
            resetForm()
            showToast('Batch', 'success')
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const resetForm = () => {
        setBtnDisabled(false)
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
            <CASMPPanel data={{}} />
            <FormHeader title='Create Production Batch' showShift />
            <BatchForm
                data={formData}
                errors={formErrors}
                onChange={handleChange}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleBatchCreate}
                    className={`
                        app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                        ${shake ? 'app-shake' : ''}
                    `}
                    text='Create Batch'
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

export default StockDetails