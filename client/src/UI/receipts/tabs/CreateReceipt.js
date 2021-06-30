import axios from 'axios';
import { message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import ReceiptForm from '../forms/Receipt';
import { http } from '../../../modules/http';
import CustomButton from '../../../components/CustomButton';
import { validateReceiptValues } from '../../../utils/validations';
import { isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { getCustomerIdOptions, getDropdownOptions } from '../../../assets/fixtures';

const CreateReceipt = ({ goToTab }) => {
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [customerList, setCustomerList] = useState([])
    const [paymentList, setPaymentList] = useState([])
    const [shake, setShake] = useState(false)

    const customerOptions = useMemo(() => getCustomerIdOptions(customerList), [customerList])
    const paymentOptions = useMemo(() => getDropdownOptions(paymentList), [paymentList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getReceiptNo()
        getCustomerList()
        getPaymentList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getCustomerList = async () => {
        const url = `customer/getCustomerIds`

        try {
            const data = await http.GET(axios, url, config)
            setCustomerList(data)
        } catch (error) { }
    }

    const getPaymentList = async () => {
        const url = `bibo/getList/paymentMode`

        try {
            const data = await http.GET(axios, url, config)
            setPaymentList(data)
        } catch (error) { }
    }

    const getReceiptNo = async () => {
        const url = 'customer/getReceiptNumber'

        try {
            const receiptNumber = await http.GET(axios, url, config)
            setFormData(prev => ({ ...prev, receiptNumber }))
        } catch (error) { }
    }

    const getCustomerDetails = async (id) => {
        const url = `customer/getCustomerDepositDetails?customerId=${id}`

        try {
            const [data] = await http.GET(axios, url, config)
            setFormData(prev => ({ ...prev, ...data }))
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'customerId') {
            getCustomerDetails(value)
        }
        else if (key === 'paymentMode' && value !== 'Cash') {
            setFormData(data => ({ ...data, transactionId: '' }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateReceiptValues(formData);
        const { customerId } = formData
        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let body = { ...formData }
        const url = 'customer/createCustomerReceipt'
        const options = { item: 'Receipt', v1Ing: 'Adding', v2: 'added' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            goToTab('1')
            resetForm()
            getReceiptNo()
            setCustomerList(customerList.filter(({ customerId: id }) => id !== customerId))
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
                <span className='title'>New Receipt Details</span>
            </div>
            <ReceiptForm
                data={formData}
                errors={formErrors}
                paymentOptions={paymentOptions}
                customerOptions={customerOptions}
                onChange={handleChange}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    disabled={btnDisabled}
                    className={`
                    app-create-btn footer-btn
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Add'
                />
            </div>
        </div>
    )
}

export default CreateReceipt

