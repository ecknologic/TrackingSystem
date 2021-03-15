import dayjs from 'dayjs';
import axios from 'axios';
import { message } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import InvoiceForm from '../forms/Invoice';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import { TODAYDATE } from '../../../../utils/constants';
import NoContent from '../../../../components/NoContent';
import CustomButton from '../../../../components/CustomButton';
import { isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
import { getCustomerOptions, getStaffOptions } from '../../../../assets/fixtures';
import { validateNumber, validateInvoiceValues } from '../../../../utils/validations';
const APIDATEFORMAT = 'YYYY-MM-DD'

const CreateInvoice = ({ goToTab, editMode, setHeader }) => {
    const defaultValues = useMemo(() => ({ invoiceDate: TODAYDATE, hsnCode: 22011010 }), [])
    const history = useHistory()
    const { invoiceId } = useParams()
    const [formData, setFormData] = useState(defaultValues)
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [salesPersonList, setSalesPersonList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const [billingAddress, setBillingAddress] = useState({})
    const [shake, setShake] = useState(false)
    const [loading, setLoading] = useState(false)

    const salesPersonOptions = useMemo(() => getStaffOptions(salesPersonList), [salesPersonList])
    const customerOptions = useMemo(() => getCustomerOptions(customerList), [customerList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        if (editMode) getInvoice()
        else getInvoiceId()
        getCustomerList()
        getSalesPersonList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getInvoice = async () => {
        const url = `/invoice/getInvoiceById/${invoiceId}`

        try {
            setLoading(true)
            const data = await http.GET(axios, url, config)
            const { products, ...rest } = data
            const { invoiceId, customerId } = rest
            getBillingAddress(customerId)
            setHeader({ title: `Invoice - ${invoiceId}` })
            setFormData(rest)
            setLoading(false)
        } catch (error) { }
    }

    const getInvoiceId = async () => {
        const url = '/invoice/getInvoiceId'

        try {
            const invoiceId = await http.GET(axios, url, config)
            setFormData(prev => ({ ...prev, invoiceId }))
        } catch (error) { }
    }

    const getSalesPersonList = async () => {
        const url = '/customer/getSalesPersons'

        try {
            const data = await http.GET(axios, url, config)
            setSalesPersonList(data)
        } catch (error) { }
    }

    const getCustomerList = async () => {
        const url = '/customer/getCustomerNames'

        try {
            const data = await http.GET(axios, url, config)
            setCustomerList(data)
        } catch (error) { }
    }

    const getBillingAddress = async (customerId) => {
        setBillingAddress({ loading: true })
        const url = `/customer/getCustomerBillingAddress/${customerId}`

        try {
            const { creditPeriodInDays, ...rest } = await http.GET(axios, url, config)
            setBillingAddress({ loading: false, ...rest, loaded: true })
            const dueDate = dayjs().add(creditPeriodInDays, 'day')
            setFormData(prev => ({ ...prev, dueDate }))
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'customerId') {
            getBillingAddress(value)
        }

        // Validations
        if (key === 'hsnCode' || key === 'poNo') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateInvoiceValues(formData);
        const { EmailId: emailId, customerName, panNo, mobileNumber, address, gstNo } = billingAddress
        const { invoiceDate, dueDate, fromDate, toDate } = formData

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let body = {
            ...formData, invoiceDate: dayjs(invoiceDate).format(APIDATEFORMAT),
            fromDate: dayjs(fromDate).format(APIDATEFORMAT), toDate: dayjs(toDate).format(APIDATEFORMAT),
            mailIds: emailId, dueDate: dayjs(dueDate).format(APIDATEFORMAT),
            customerName, panNo, mobileNumber, address, gstNo
        }

        const url = getUrl(editMode)
        const options = { item: 'Invoice', ...getVerbs(editMode) }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            if (!editMode) {
                resetForm()
                goToTab('1')
                getInvoiceId()
            } else {
                history.push('/invoices')
            }
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
            else if (error.response.status === 400) {
                message.info('Oops! Already generated or DCs do not exist for the selection.')
            }
            else if (error.response.status === 404) {
                message.info('Oops! DCs do not exist for the selection.')
            }
        }
    }

    const resetForm = () => {
        setBtnDisabled(false)
        resetTrackForm()
        setFormData(defaultValues)
        setFormErrors({})
    }

    if (loading) return <NoContent content={<Spinner />} />

    return (
        <div className='stock-delivery-container'>
            <div className='invoice-title-container'>
                <span className='title'>{`${editMode ? '' : 'New'} Invoice Details`}</span>
            </div>
            <InvoiceForm
                data={formData}
                errors={formErrors}
                customerList={customerList}
                billingAddress={billingAddress}
                customerOptions={customerOptions}
                salesPersonOptions={salesPersonOptions}
                onChange={handleChange}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    className={`
                    app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                    ${shake ? 'app-shake' : ''}
                `}
                    text={editMode ? 'Update' : 'Generate'}
                />
            </div>
        </div>
    )
}

const getVerbs = (editMode) => {
    let v1Ing = 'adding'
    let v2 = 'added'
    if (editMode) {
        v1Ing = 'Updating'
        v2 = 'updated'
    }

    return { v1Ing, v2 }
}
const getUrl = (editMode) => {
    const createUrl = '/invoice/createInvoice'
    const updateUrl = '/invoice/updateInvoice'
    return editMode ? updateUrl : createUrl
}
export default CreateInvoice
