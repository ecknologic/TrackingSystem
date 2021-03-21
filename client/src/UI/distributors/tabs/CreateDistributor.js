import axios from 'axios';
import { message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http';
import DistributorForm from '../forms/Distributor';
import { getUserId } from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';
import { extractDistributorDetails, extractProductsFromForm, getBase64, getProductsForDB, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { validateMobileNumber, validateNames, validateDistributorValues, validateEmailId } from '../../../utils/validations';

const CreateEmployee = ({ goToTab }) => {
    const USERID = getUserId()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
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
        if (key === 'agencyName' || key === 'operationalArea' || key === 'contactPerson') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber' || key === 'alternateNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {

        // Validations
        if (key === 'mailId' || key === 'alternateMailId') {
            const error = validateEmailId(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber' || key === 'alternateNumber') {
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
        const formErrors = validateDistributorValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const productsUI = extractProductsFromForm(formData)
        const products = getProductsForDB(productsUI)
        const data = extractDistributorDetails(formData)

        let body = {
            ...data, products, createdBy: USERID
        }
        const url = '/distributor/createDistributor'
        const options = { item: 'Distributor', v1Ing: 'Adding', v2: 'added' }
        console.log('body>>', body)
        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            goToTab('1')
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

    return (
        <div className='employee-manager-content'>
            <div className='employee-title-container'>
                <span className='title'>New Distributor Details</span>
            </div>
            <DistributorForm
                data={formData}
                errors={formErrors}
                onBlur={handleBlur}
                onChange={handleChange}
                onUpload={handleUpload}
                onRemove={handleRemove}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    className={`
                    app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Add'
                />
            </div>
        </div>
    )
}

export default CreateEmployee