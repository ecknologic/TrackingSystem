import axios from 'axios';
import dayjs from 'dayjs';
import { message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import EnquiryForm from '../forms/Enquiry';
import { http } from '../../../modules/http';
import useUser from '../../../utils/hooks/useUser';
import { MARKETINGADMIN, DATEFORMAT } from '../../../utils/constants';
import { getDropdownOptions, getStaffOptions } from '../../../assets/fixtures';
import CustomButton from '../../../components/CustomButton';
import { validateMobileNumber, validateEmailId, validateEnquiryValues } from '../../../utils/validations';
import { extractDistributorDetails, extractProductsFromForm, getProductsForDB, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';

const CreateEnquiry = ({ goToTab }) => {
    const { USERID } = useUser()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [agentList, setAgentList] = useState([])
    const [businessList, setBusinessList] = useState([])
    const [shake, setShake] = useState(false)

    const agentOptions = useMemo(() => getStaffOptions(agentList), [agentList])
    const businessOptions = useMemo(() => getDropdownOptions(businessList), [businessList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getAgentList()
        getBusinessList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getAgentList = async () => {
        const url = `users/getUsersByRole/${MARKETINGADMIN}`

        try {
            const data = await http.GET(axios, url, config)
            setAgentList(data)
        } catch (error) { }
    }

    const getBusinessList = async () => {
        const url = `bibo/getList/natureOfBusiness`

        try {
            const data = await http.GET(axios, url, config)
            setBusinessList(data)
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (value === 'notintrested') {
            setFormData(data => ({ ...data, revisitDate: '' }))
        }

        // Validations
        if (key === 'mobileNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {

        // Validations
        if (key === 'EmailId') {
            const error = validateEmailId(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateEnquiryValues(formData)
        const products = getProductsForDB(formData)
        const revisitDate = formData.revisitDate ? dayjs(formData.revisitDate).format(DATEFORMAT) : null


        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const body = {
            ...formData, revisitDate, products, createdBy: USERID
        }
        const url = 'customer/createCustomerEnquiry'
        const options = { item: 'Customer Enquiry', v1Ing: 'Adding', v2: 'added' }

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
                <span className='title'>New Customer Enquiry</span>
            </div>
            <EnquiryForm
                data={formData}
                errors={formErrors}
                onBlur={handleBlur}
                onChange={handleChange}
                agentOptions={agentOptions}
                businessOptions={businessOptions}
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

export default CreateEnquiry