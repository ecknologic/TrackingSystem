import axios from 'axios';
import dayjs from 'dayjs';
import { message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import ClosureForm from '../forms/Closure';
import { http } from '../../../modules/http';
import CustomButton from '../../../components/CustomButton';
import { validateClosureAccValues, validateClosureValues, validateIFSCCode, validateNumber } from '../../../utils/validations';
import { isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { getCustomerIdOptions, getDepartmentOptions, getDriverOptions, getLocationOptions, getRouteOptions } from '../../../assets/fixtures';
const APIDATEFORMAT = 'YYYY-MM-DD'

const CreateEnquiry = ({ goToTab }) => {
    const [formData, setFormData] = useState({})
    const [accData, setAccData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [accErrors, setAccErrors] = useState({})
    const [driverList, setDriverList] = useState([])
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [customerList, setCustomerList] = useState([])
    const [warehouseList, setWarehouseList] = useState([])
    const [locationList, setLocationList] = useState([])
    const [routeList, setRouteList] = useState([])
    const [shake, setShake] = useState(false)

    const routeOptions = useMemo(() => getRouteOptions(routeList), [routeList])
    const driverOptions = useMemo(() => getDriverOptions(driverList), [driverList])
    const warehouseOptions = useMemo(() => getDepartmentOptions(warehouseList), [warehouseList])
    const customerOptions = useMemo(() => getCustomerIdOptions(customerList), [customerList])
    const locationOptions = useMemo(() => getLocationOptions(locationList), [locationList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getCustomerList()
        getWarehouseList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getDriverList = async (warehouseId) => {
        const url = `bibo/getdriverDetails/${warehouseId}`

        try {
            const data = await http.GET(axios, url, config)
            setDriverList(data)
        } catch (error) { }
    }

    const getCustomerList = async () => {
        const url = 'customer/getCustomerIdsByAgent'

        try {
            const data = await http.GET(axios, url, config)
            setCustomerList(data)
        } catch (error) { }
    }

    const getRouteList = async (warehouseId) => {
        const url = `customer/getRoutes/${warehouseId}`

        try {
            const data = await http.GET(axios, url, config)
            setRouteList(data)
        } catch (error) { }
    }

    const getDeliveryLocations = async (id) => {
        const url = `customer/getCustomerDeliveryIds?customerId=${id}`

        try {
            const data = await http.GET(axios, url, config)
            setLocationList(data)
        } catch (error) { }
    }

    const getWarehouseList = async () => {
        const url = 'bibo/getDepartmentsList?departmentType=Warehouse'

        try {
            const data = await http.GET(axios, url, config)
            setWarehouseList(data)
        } catch (error) { }
    }

    const getDeliveryDetails = async (id) => {
        const url = `customer/getDepositDetailsByDeliveryId?deliveryId=${id}`

        try {
            const [data] = await http.GET(axios, url, config)
            getDriverList(data.departmentId)
            getRouteList(data.departmentId)
            setFormData(prev => ({ ...prev, ...data, totalAmount: data.balanceAmount }))
        } catch (error) { }
    }

    const getAccountDetails = async (id) => {
        const url = `customer/getCustomerAccountDetailsById/${id}`

        try {
            const [data = {}] = await http.GET(axios, url, config)
            setAccData(data)
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'customerId') {
            const [{ customerName }] = customerList.filter(item => item.customerId === value)
            setFormData(prev => ({ ...prev, customerName }))
            resetDeliveryDetails()
            getDeliveryLocations(value)
            getAccountDetails(value)
        }
        else if (key === 'deliveryDetailsId') {
            getDeliveryDetails(value)
        }
        else if (key === 'departmentId') {
            getDriverList(value)
            getRouteList(value)
            setFormData(prev => ({ ...prev, driverId: null, routeId: null }))
        }
        else if (numerics.includes(key)) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))

            if (!error) {
                if (key === 'pendingAmount') {
                    const balanceAmount = Number(value) + Number(formData.depositAmount || 0)
                    const totalAmount = balanceAmount + Number(formData.missingCansAmount || 0)
                    setFormData(prev => ({ ...prev, balanceAmount, totalAmount }))
                }
                else if (key === 'depositAmount') {
                    const balanceAmount = Number(value) + Number(formData.pendingAmount || 0)
                    const totalAmount = balanceAmount + Number(formData.missingCansAmount || 0)
                    setFormData(prev => ({ ...prev, balanceAmount, totalAmount }))
                }
                else if (key === 'balanceAmount') {
                    const totalAmount = Number(value) + Number(formData.missingCansAmount || 0)
                    setFormData(prev => ({ ...prev, totalAmount }))
                }
                else if (key === 'missingCansAmount') {
                    const totalAmount = Number(value) + Number(formData.balanceAmount || 0)
                    setFormData(prev => ({ ...prev, totalAmount }))
                }
            }
        }
    }

    const handleAccChange = (value, key) => {
        setAccData(data => ({ ...data, [key]: value }))
        setAccErrors(errors => ({ ...errors, [key]: '' }))
    }

    const handleAccBlur = (value, key) => {

        // Validations
        if (key === 'ifscCode') {
            const error = validateIFSCCode(value, true)
            setAccErrors(errors => ({ ...errors, [key]: error }))
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
        const { closingDate, collectedDate, driverAssignedOn } = formData
        const formErrors = validateClosureValues(formData)
        const accErrors = validateClosureAccValues(accData)

        if (!isEmpty(formErrors) || !isEmpty(accErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            setAccErrors(accErrors)
            return
        }

        const body = {
            ...formData, accountDetails: accData,
            driverAssignedOn: dayjs(driverAssignedOn).format(APIDATEFORMAT),
            closingDate: closingDate ? dayjs(closingDate).format(APIDATEFORMAT) : null,
            collectedDate: collectedDate ? dayjs(collectedDate).format(APIDATEFORMAT) : null,
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
        setAccData({})
        setAccErrors({})
    }

    return (
        <div className='employee-manager-content'>
            <div className='employee-title-container'>
                <span className='title'>New Closure Form</span>
            </div>
            <ClosureForm
                data={formData}
                accData={accData}
                errors={formErrors}
                accErrors={accErrors}
                onAccBlur={handleAccBlur}
                onChange={handleChange}
                onAccChange={handleAccChange}
                routeOptions={routeOptions}
                driverOptions={driverOptions}
                customerOptions={customerOptions}
                locationOptions={locationOptions}
                warehouseOptions={warehouseOptions}
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

const numerics = [
    'pendingAmount', 'depositAmount', 'balanceAmount',
    'missingCansAmount', 'noOfCans', 'collectedCans',
    'missingCansCount', 'missingCansAmount', 'totalAmount'
]
export default CreateEnquiry