import dayjs from 'dayjs';
import axios from 'axios';
import { message } from 'antd';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { http } from '../../../../modules/http';
import { TRACKFORM } from '../../../../utils/constants';
import FormHeader from '../../../../components/FormHeader';
import MaterialRequestForm from '../forms/StockRequest';
import ConfirmModal from '../../../../components/CustomModal';
import CustomButton from '../../../../components/CustomButton';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { getDepartmentOptions } from '../../../../assets/fixtures';
import { getProductsForDB, isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
import { validateNumber, validateIntFloat, validateRequestStockValues } from '../../../../utils/validations';

const RequestStock = ({ goToTab }) => {
    const [formData, setFormData] = useState(REQUIREDVALUES)
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [motherplantList, setMotherplantList] = useState([])
    const [shake, setShake] = useState(false)

    const motherplantOptions = useMemo(() => getDepartmentOptions(motherplantList), [motherplantList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getMotherplantList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getMotherplantList = async () => {
        const url = 'bibo/getDepartmentsList?departmentType=MotherPlant'

        try {
            const data = await http.GET(axios, url, config)
            setMotherplantList(data)
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key.includes('Level') || key === 'itemQty') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('product')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key.includes('Level') || key === 'itemQty') {
            const error = validateNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value, true)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
        }
    }

    const handleSubmit = async () => {
        const { requestTo, requiredDate, ...rest } = formData
        const formErrors = validateRequestStockValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const products = getProductsForDB(rest)
        const body = { requestTo, requiredDate: dayjs(requiredDate).format('YYYY-MM-DD'), products }
        const url = 'warehouse/requestStock'
        const options = { item: 'Stock Request', v1Ing: 'Sending', v2: 'sent' }


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
            <FormHeader title='Stock Required' />
            <MaterialRequestForm
                track
                data={formData}
                errors={formErrors}
                onChange={handleChange}
                onBlur={handleBlur}
                motherplantOptions={motherplantOptions}
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
export default RequestStock