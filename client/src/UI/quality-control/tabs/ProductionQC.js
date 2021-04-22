import axios from 'axios';
import { message } from 'antd';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { http } from '../../../modules/http';
import { TRACKFORM } from '../../../utils/constants';
import ProductionQCForm from '../forms/ProductionQCForm';
import ConfirmModal from '../../../components/CustomModal';
import CustomButton from '../../../components/CustomButton';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { getBatchOptions, testResultOptions } from '../../../assets/fixtures';
import { validateIntFloat, validateNames, validateQCcheckValues } from '../../../utils/validations';
import { isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';

const ProductionQC = ({ goToTab }) => {
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [batchList, setBatchList] = useState([])
    const [shake, setShake] = useState(false)
    const [QCList, setQCList] = useState([])

    const batchOptions = useMemo(() => getBatchOptions(batchList), [batchList])
    const childProps = useMemo(() => ({ batchOptions, testResultOptions }), [batchOptions, testResultOptions])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getBatchsList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getBatchsList = async () => {
        const url = `motherPlant/getBatchNumbers`

        try {
            const data = await http.GET(axios, url, config)
            setBatchList(data)
        } catch (error) { }
    }

    const getQCByProductionQcId = async (productionQcId) => {
        const url = `motherPlant/getQCLevelsDetails/${productionQcId}`

        try {
            const data = await http.GET(axios, url, config)
            setQCList(data)
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'productionQcId') getQCByProductionQcId(value)

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
        const formErrors = validateQCcheckValues(formData, 'prod')
        const { productionQcId } = formData
        let approveProd = 1

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        QCList.map((item) => {
            if (item.qcLevel != 1 && item.testResult === 'Approved') {
                approveProd = 0
            }
        })

        const { batchId } = batchList.find(item => item.productionQcId === productionQcId)
        const qcLevel = QCList.length + 1
        let body = {
            ...formData, qcLevel, batchId, approveProd
        }
        const url = 'motherplant/createQualityCheck'
        const options = { item: 'QC Report', v1Ing: 'Sending', v2: 'sent' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            goToTab('5')
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
        setQCList([])
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
            <ProductionQCForm
                track
                QCList={QCList}
                data={formData}
                errors={formErrors}
                onChange={handleChange}
                onBlur={handleBlur}
                {...childProps}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    disabled={btnDisabled}
                    className={`
                    app-create-btn footer-btn
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Send Report'
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

export default ProductionQC