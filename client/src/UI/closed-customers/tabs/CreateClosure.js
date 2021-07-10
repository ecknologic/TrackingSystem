import axios from 'axios';
import { message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import ClosureForm from '../forms/Closure';
import { http } from '../../../modules/http';
import useUser from '../../../utils/hooks/useUser';
import CustomButton from '../../../components/CustomButton';
import { validateClosureValues, validateIFSCCode } from '../../../utils/validations';
import { isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { getCustomerIdOptions, getLocationOptions, getRouteOptions } from '../../../assets/fixtures';

const CreateEnquiry = ({ goToTab }) => {
    const { USERID } = useUser()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [customerList, setCustomerList] = useState([])
    const [locationList, setLocationList] = useState([])
    const [routeList, setRouteList] = useState([])
    const [shake, setShake] = useState(false)

    const routeOptions = useMemo(() => getRouteOptions(routeList), [routeList])
    const customerOptions = useMemo(() => getCustomerIdOptions(customerList), [customerList])
    const locationOptions = useMemo(() => getLocationOptions(locationList), [locationList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getRouteList()
        getCustomerList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getCustomerList = async () => {
        const url = 'customer/getCustomerIdsByAgent'

        try {
            const data = await http.GET(axios, url, config)
            setCustomerList(data)
        } catch (error) { }
    }

    const getRouteList = async () => {
        const url = `customer/getRoutes/0`

        try {
            const data = await http.GET(axios, url, config)
            setRouteList(data)
        } catch (error) { }
    }

    const getCustomerDetails = async (id) => {
        const url = `customer/getCustomerDepositDetails?customerId=${id}`

        try {
            const [data] = await http.GET(axios, url, config)
            setFormData(prev => ({ ...prev, ...data }))
        } catch (error) { }
    }

    const getDeliveryLocations = async (id) => {
        const url = `customer/getCustomerDeliveryIds?customerId=${id}`

        try {
            const data = await http.GET(axios, url, config)
            setLocationList(data)
        } catch (error) { }
    }

    const getDeliveryDetails = async (id) => {
        const url = `customer/getDepositDetailsByDeliveryId?deliveryId=${id}`

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
            resetDeliveryDetails()
            getCustomerDetails(value)
            getDeliveryLocations(value)
        }
        else if (key === 'deliveryDetailsId') {
            getDeliveryDetails(value)
        }
    }

    const handleBlur = (value, key) => {

        // Validations
        if (key === 'ifscCode') {
            const error = validateIFSCCode(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const resetDeliveryDetails = () => {
        const data = {
            deliveryDetailsId: null,
            depositAmount: null, noOfCans: null,
            pendingAmount: null, totalAmount: null
        }
        setFormData(prev => ({ ...prev, ...data }))
    }

    const handleSubmit = async () => {
        const { customerId } = formData
        const formErrors = validateClosureValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const body = {
            ...formData, createdBy: USERID
        }
        const url = 'customer/addCustomerClosingDetails'
        const options = { item: 'Customer Closure', v1Ing: 'Adding', v2: 'added' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            goToTab('1')
            resetForm()
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
                <span className='title'>New Closure Form</span>
            </div>
            <ClosureForm
                data={formData}
                errors={formErrors}
                onBlur={handleBlur}
                onChange={handleChange}
                routeOptions={routeOptions}
                customerOptions={customerOptions}
                locationOptions={locationOptions}
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