import axios from 'axios';
import { message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BatchForm from '../forms/Batch';
import { http } from '../../../../modules/http';
import useUser from '../../../../utils/hooks/useUser';
import FormHeader from '../../../../components/FormHeader';
import CASMPPanel from '../../../../components/CASMPPanel';
import ConfirmModal from '../../../../components/CustomModal';
import CustomButton from '../../../../components/CustomButton';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { shiftOptions, getBatchIdOptions } from '../../../../assets/fixtures';
import { extractValidProductsForDB, isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
import { validateBatchValues, validateIntFloat, validateNames, validateNumber } from '../../../../utils/validations';

const StockDetails = ({ date, source, goToTab }) => {
    const { USERID } = useUser()
    const [stock, setStock] = useState({})
    const [currentStock, setCurrentStock] = useState({})
    const [formData, setFormData] = useState({})
    const [batchList, setBatchList] = useState([])
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)

    const batchOptions = useMemo(() => getBatchIdOptions(batchList), [batchList])
    const childProps = useMemo(() => ({ batchOptions, shiftOptions }), [batchOptions, shiftOptions])
    const config = { cancelToken: source.token }

    useEffect(() => {
        resetForm()
        getCurrentStock()
        getActiveStockByDate(date)

        return () => {
            http.ABORT(source)
        }
    }, [date])

    const getBatchesList = async (shiftType) => {
        const url = `motherPlant/getProductionBatchIds/${shiftType}`

        try {
            const data = await http.GET(axios, url, config)
            setBatchList(data)
        } catch (error) { }
    }

    const getActiveStockByDate = async (date) => {
        const url = `motherPlant/getProductionDetailsByDate/${date}`

        try {
            const data = await http.GET(axios, url, config)
            setStock(data)
        } catch (error) { }
    }

    const getCurrentStock = async () => {
        const url = 'motherPlant/getCurrentStockDetails'

        try {
            const data = await http.GET(axios, url, config)
            setCurrentStock(data)
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'shiftType') {
            setFormData(data => ({ ...data, batchId: null }))
            getBatchesList(value)
        }

        // Validations
        if (key === 'managerName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phLevel' || key === 'ozoneLevel' || key === 'TDS') {
            const error = validateIntFloat(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('product')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, products: error }))
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
        const formErrors = validateBatchValues(formData, currentStock)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const { product20L, product2L, product1L, product500ML, product300ML } = extractValidProductsForDB(formData)

        const url = 'motherPlant/addProductionDetails'
        const body = {
            ...formData, createdBy: USERID, ...currentStock,
            product20L, product2L, product1L, product500ML, product300ML
        }
        const options = { item: 'Production Batch', v1Ing: 'Adding', v2: 'added' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            resetForm()
            goToTab('2')
            showToast(options)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
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
            <CASMPPanel data={stock} />
            <FormHeader title='Add Production Batch' />
            <BatchForm
                track
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
                    text='Add Batch'
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

export default StockDetails