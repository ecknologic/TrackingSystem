import { message } from 'antd';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import CustomButton from '../../../components/CustomButton';
import QualityCheckForm from '../forms/QualityCheck';
import ConfirmModal from '../../../components/CustomModal';
import { TRACKFORM } from '../../../utils/constants';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { http } from '../../../modules/http';
import { getBatchIdOptions, testResultOptions } from '../../../assets/fixtures';
import { isEmpty, removeFormTracker, resetTrackForm, showToast, trackAccountFormOnce } from '../../../utils/Functions';
import { validateIntFloat, validateNames, validateQCcheckValues } from '../../../utils/validations';

const ProductionQualityCheck = ({ goToTab }) => {
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [batchList, setBatchList] = useState([])
    const [shake, setShake] = useState(false)
    const [QC, setQC] = useState({})

    const batchIdOptions = useMemo(() => getBatchIdOptions(batchList), [batchList])
    const childProps = useMemo(() => ({ batchIdOptions, testResultOptions }), [batchIdOptions, testResultOptions])

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()
        getBatchsList()

        return () => {
            removeFormTracker()
        }
    }, [])

    const getBatchsList = async () => {
        const data = await http.GET(`/motherPlant/getBatchNumbers`)
        setBatchList(data)
    }

    const getQCByBatchId = async (batchId) => {
        const [data = {}] = await http.GET(`/motherPlant/getQCDetailsByBatch/${batchId}`)
        setQC(data)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'batchId') getQCByBatchId(value)

        // Validations
        if (key === 'managerName' || key === 'testType') {
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
        const formErrors = validateQCcheckValues(formData)
        const { productionQcId } = QC

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let body = {
            ...formData, productionQcId
        }
        const url = '/motherplant/createQualityCheck'

        try {
            setBtnDisabled(true)
            showToast('QC Report', 'loading')
            await http.POST(url, body)
            // resetForm()
            goToTab('3')
            showToast('QC Report', 'success')
        } catch (error) {
            message.destroy()
            setBtnDisabled(false)
        }
    }

    const resetForm = () => {
        setBtnDisabled(false)
        resetTrackForm()
        setFormData({})
        setQC({})
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
            <QualityCheckForm
                track
                QC={QC}
                data={formData}
                errors={formErrors}
                onChange={handleChange}
                onBlur={handleBlur}
                {...childProps}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    className={`
                    app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Send Report'
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

export default ProductionQualityCheck