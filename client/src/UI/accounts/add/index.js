import { nanoid } from 'nanoid';
import { Divider, Checkbox, Collapse, message } from 'antd';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons'
import Header from './header';
import Delivery from './forms/Delivery';
import CustomButton from '../../../components/CustomButton';
import CorporateAccount from './forms/CorporateAccount';
import GeneralAccount from './forms/GeneralAccount';
import { getIdProofName, getBase64, deepClone } from '../../../utils/Functions';
import CollapseForm from './forms/CollapseForm';
import { getRouteOptions } from '../../../assets/fixtures';
import { http } from '../../../modules/http'
import { TODAYDATE, USERID, WAREHOUSEID } from '../../../utils/constants';

const AddAccount = () => {
    const [importId, setImportId] = useState('')
    const [resetId, setResetId] = useState('')
    const [corporate, setCorporate] = useState(true)
    const [formValues, setFormValues] = useState({})
    const [addresses, setAddresses] = useState([])
    const hasExtraAddress = !!addresses.length
    const [routes, setRoutes] = useState([])
    const routeOptions = useMemo(() => getRouteOptions(routes), [routes])

    const highlight = { backgroundColor: '#5C63AB', color: '#fff' }
    const fade = { backgroundColor: '#EBEBEB', color: '#1B2125' }

    useEffect(() => {
        getRoutes()
        sessionStorage.removeItem('address1')
        sessionStorage.removeItem('address2')
        sessionStorage.removeItem('address3')
        sessionStorage.removeItem('address4')
        sessionStorage.removeItem('address5')
    }, [])

    useEffect(() => {
        resetAccountFormValues()
        resetDeliveryFormValues()
    }, [corporate])

    const getRoutes = async () => {
        try {
            const data = await http.GET('/warehouse/getroutes')
            setRoutes(data)
        } catch (ex) { }
    }

    const handleIdProofUpload = (file) => {
        getBase64(file, async (buffer) => {
            const { idProofs = [] } = formValues
            idProofs.push(buffer)
            setFormValues(data => ({ ...data, idProofs }))
        })
    }

    const handleIdProofSelect = (value) => {
        const proofName = getIdProofName(value)
        const proofData = { proofSelect: value, proofValue: '', proofName, idProofs: [] }
        setFormValues(data => ({ ...data, ...proofData }))
    }

    const handleChange = (value, key) => {
        setFormValues(data => ({ ...data, [key]: value }))
    }

    const handleMultiSelect = (value, key) => {
        const clone = deepClone(formValues[key] || [])
        clone.push(value)
        setFormValues(data => ({ ...data, deliveryDays: clone }))
    }

    const handleMultiDeselect = (value, key) => {
        const clone = deepClone(formValues[key] || [])
        const filtered = clone.filter(day => day !== value)
        setFormValues(data => ({ ...data, [key]: filtered }))
    }

    const extractDeliveryFormValues = (products) => {
        const {
            dGstNo, depositAmount, routingId, deliveryDays,
            phoneNumber, contactPerson, shippingAddress: address, deliveryLocation
        } = formValues

        return {
            gstNo: dGstNo, depositAmount, products, routingId, deliveryDays,
            mobileNumber: phoneNumber, contactPerson, address, deliveryLocation
        }
    }

    const extractAccountFormValues = () => {
        const {
            gstNo, natureOfBussiness, organizationName,
            address, customerName, mobileNumber, invoicetype,
            creditPeriodInDays, EmailId, referredBy, panNo, adharNo, proofSelect: idProofType,
            idProofs, depositAmount, deliveryDays, invoiceType, contactPerson
        } = formValues

        if (corporate) return {
            gstNo, natureOfBussiness, organizationName, panNo, adharNo,
            address1: address, customerName, mobileNumber, invoicetype,
            creditPeriodInDays, EmailId, referredBy, gstProof: idProofs[0],
            idProofType, idProofs, customerType: 'corporate', createdBy: USERID,
            departmentId: WAREHOUSEID, registeredDate: TODAYDATE,
        }

        return {
            createdBy: USERID, departmentId: WAREHOUSEID, registeredDate: TODAYDATE,
            gstNo, address1: address, customerName, mobileNumber,
            invoiceType, EmailId, contactPerson, gstProof: idProofs[0],
            idProofType, idProofs, customerType: 'general', panNo, adharNo,
            deliveryDetails: [{
                deliveryDays, contactPerson, gstNo,
                address, phoneNumber: mobileNumber, depositAmount
            }]
        }
    }

    const resetAccountFormValues = () => {
        const resetValues = {
            dGstNo: '', organizationName: '', address: '', invoicetype: undefined,
            mobileNumber: '', natureOfBussiness: undefined, address: '',
            customerName: '', routingId: undefined, deliveryDays: undefined, creditPeriodInDays: undefined,
            phoneNumber: '', contactPerson: '', address: '', deliveryLocation: '',
            products: undefined, EmailId: '', referredBy: '', proofName: '', proofSelect: undefined,
            proofInput: '', idProofs: [], depositAmount: ''
        }

        setFormValues(data => ({ ...data, ...resetValues }))
    }
    const resetDeliveryFormValues = () => {
        const resetValues = {
            dGstNo: '', depositAmount: '', routingId: undefined, deliveryDays: undefined,
            phoneNumber: '', contactPerson: '', shippingAddress: '', deliveryLocation: '',
            products: undefined
        }
        setResetId(nanoid(5))
        setFormValues(data => ({ ...data, ...resetValues }))
    }

    const _Delivery = (products) => {
        const limit = 5

        if (importId.includes('create')) {
            const devFormValues = extractDeliveryFormValues(products)
            handleCreateAccount(devFormValues)
        }
        else if (addresses.length < limit) {
            const devFormValues = extractDeliveryFormValues(products)

            // Validate delivery form values (except products)

            const clone = deepClone(addresses)
            clone.push(devFormValues)
            setAddresses(clone)
            resetDeliveryFormValues()
        }
    }

    const getSessionAddresses = () => {
        const add1 = JSON.parse(sessionStorage.getItem('address0'))
        const add2 = JSON.parse(sessionStorage.getItem('address1'))
        const add3 = JSON.parse(sessionStorage.getItem('address2'))
        const add4 = JSON.parse(sessionStorage.getItem('address3'))
        const add5 = JSON.parse(sessionStorage.getItem('address4'))

        const addresses = [add1, add2, add3, add4, add5]

        const filtered = addresses.filter(item => item !== null)

        return filtered
    }

    const handleCreateAccount = async (currentAddress) => {
        let body
        const accountFormValues = extractAccountFormValues()

        if (!corporate) {
            body = accountFormValues
        }
        else {
            const sessonAddresses = getSessionAddresses()
            const deliveryDetails = [...sessonAddresses, currentAddress]

            body = { ...accountFormValues, deliveryDetails }
        }

        //validate data here
        // console.log(finalData)

        const url = '/customer/createCustomer'
        try {
            await http.POST(url, body)
            message.success('Create Customer successfully!')
        } catch (error) {

        }

    }

    const onCreate = () => {
        if (!corporate) handleCreateAccount()
        else setImportId(`create${nanoid(5)}`)
    }
    const onAdd = () => setImportId(nanoid(5))

    return (
        <Fragment>
            <Header />
            <div className='account-add-content'>
                <div className='header-buttons-container'>
                    <CustomButton
                        className='big'
                        style={corporate ? highlight : fade}
                        text='Corporate Customers' onClick={() => setCorporate(true)}
                    />
                    <CustomButton
                        className='big second'
                        style={corporate ? fade : highlight}
                        text='Other Customers' onClick={() => setCorporate(false)}
                    />
                </div>
                {
                    corporate ? (
                        <CorporateAccount
                            data={formValues}
                            onUpload={handleIdProofUpload}
                            onChange={handleChange}
                            onIdProofSelect={handleIdProofSelect}
                        />
                    ) : (
                            <GeneralAccount
                                data={formValues}
                                onUpload={handleIdProofUpload}
                                onChange={handleChange}
                                onIdProofSelect={handleIdProofSelect}
                                onSelect={handleMultiSelect}
                                onDeselect={handleMultiDeselect}
                            />
                        )
                }
                {
                    corporate ? (
                        <>
                            <div className='checkbox-container'>
                                <Checkbox /> <span className='text'>Delivery to the same address?</span>
                            </div>
                            <Divider />
                            <div className='title-container'>
                                <span className='title'>Delivery Details</span>
                                {hasExtraAddress && <CustomButton onClick={onAdd} text='Add New' className='app-add-new-btn' icon={<PlusOutlined />} />}
                            </div>
                            {
                                hasExtraAddress && addresses.map((item, index) => {
                                    const { deliveryLocation, address } = item
                                    return (
                                        <Collapse
                                            accordion
                                            expandIconPosition='right'
                                            key={index}
                                        >
                                            <Panel header={deliveryLocation} forceRender>
                                                <CollapseForm
                                                    data={item}
                                                    routeOptions={routeOptions}
                                                />
                                            </Panel>
                                        </Collapse>
                                    )
                                })
                            }
                            <Delivery
                                data={formValues}
                                onChange={handleChange}
                                onAdd={onAdd}
                                hasExtraAddress={hasExtraAddress}
                                getId={importId}
                                resetId={resetId}
                                onGet={_Delivery}
                                onSelect={handleMultiSelect}
                                onDeselect={handleMultiDeselect}
                                routeOptions={routeOptions}
                            />
                        </>
                    ) : null
                }
                <div className='footer-buttons-container'>
                    <CustomButton
                        className='app-cancel-btn footer-btn'
                        text='Cancel'
                    />
                    <CustomButton
                        onClick={onCreate}
                        className='app-create-btn footer-btn'
                        text='Create Account'
                    />
                </div>
            </div>
        </Fragment>
    )
}
const { Panel } = Collapse
export default AddAccount
