import axios from 'axios';
import { message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import InvoiceForm from '../forms/Invoice';
import { http } from '../../../modules/http';
import ProductsTable from '../forms/ProductsTable';
import InvoiceRestForm from '../forms/InvoiceRest';
import { TODAYDATE } from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';
import { isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { validateIntFloat, validateNames, validateNumber, validateProductValues } from '../../../utils/validations';

const CreateInvoice = ({ goToTab }) => {
    const defaultValues = useMemo(() => ({ invoiceDate: TODAYDATE }), [])
    const [formData, setFormData] = useState(defaultValues)
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
        if (key === 'salesPerson') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'hsnCode' || key === 'poNo') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {

        // Validations
        if (key === 'price' || key === 'tax') {
            const error = validateIntFloat(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateProductValues(formData);

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let body = { ...formData }
        const url = '/products/createProduct'
        const options = { item: 'Product', v1Ing: 'Adding', v2: 'added' }

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
        <div className='stock-delivery-container'>
            <div className='invoice-title-container'>
                <span className='title'>New Invoice Details</span>
            </div>
            <InvoiceForm
                data={formData}
                errors={formErrors}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <ProductsTable />
            <InvoiceRestForm
                data={formData}
                errors={formErrors}
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
                    text='Create'
                />
            </div>
        </div>
    )
}

export default CreateInvoice

