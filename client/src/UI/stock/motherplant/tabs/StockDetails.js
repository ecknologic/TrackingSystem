import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BatchForm from '../forms/Batch';
import { http } from '../../../../modules/http';
import CASMPPanel from '../../../../components/CASMPPanel';
import CustomButton from '../../../../components/CustomButton';
import FormHeader from '../../../../components/FormHeader';
import ConfirmModal from '../../../../components/CustomModal';
import { getUserId } from '../../../../utils/constants';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { shiftOptions, getBatchIdOptions } from '../../../../assets/fixtures';
import { extractValidProductsForDB, isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
import { validateBatchValues, validateIntFloat, validateNames, validateNumber } from '../../../../utils/validations';

const StockDetails = ({ date, goToTab }) => {
    const USERID = getUserId()
    const [formData, setFormData] = useState({})
    const [stock, setStock] = useState({})
    const [batchList, setBatchList] = useState([])
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)

    const batchOptions = useMemo(() => getBatchIdOptions(batchList), [batchList])
    const childProps = useMemo(() => ({ batchOptions, shiftOptions }), [batchOptions, shiftOptions])

    useEffect(() => {
        getBatchesList()
    }, [])

    useEffect(() => {
        resetForm()
        getActiveStockByDate(date)
    }, [date])

    const getBatchesList = async () => {
        const data = await http.GET('/motherPlant/getProductionBatchIds')
        setBatchList(data)
    }

    const getActiveStockByDate = async (date) => {
        const url = `/motherPlant/getProductionDetailsByDate/${date}`
        const data = await http.GET(url)
        setStock(data)
    }

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
        const formErrors = validateBatchValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const { product20L, product1L, product500ML, product250ML } = extractValidProductsForDB(formData)

        const url = '/motherPlant/addProductionDetails'
        const body = {
            ...formData, createdBy: USERID,
            product20L, product1L, product500ML, product250ML
        }
        const options = { item: 'Production Batch', v1Ing: 'Creating', v2: 'created' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(url, body)
            resetForm()
            goToTab('2')
            showToast(options)
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
            <CASMPPanel data={stock} />
            <FormHeader title='Create Production Batch' />
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
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </>
    )
}

export default StockDetails