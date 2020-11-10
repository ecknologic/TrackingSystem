import { useHistory } from 'react-router-dom';
import { Divider, Checkbox, Collapse, message } from 'antd';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons'
import Header from './header';
import Delivery from './forms/Delivery';
import CustomButton from '../../../components/CustomButton';
import CorporateAccount from './forms/CorporateAccount';
import GeneralAccount from './forms/GeneralAccount';
import CollapseForm from './forms/CollapseForm';
import { http } from '../../../modules/http'
import { getRouteOptions } from '../../../assets/fixtures';
import {
    getBase64, deepClone, getIdProofsForDB, getDevDaysForDB, getAddressesForDB,
    getProductsForDB, extractGADeliveryDetails, extractGADetails
} from '../../../utils/Functions';
import { TODAYDATE, USERID, USERNAME, WAREHOUSEID } from '../../../utils/constants';
import {
    validateAccountValues, validateDeliveryValues, validateDevDays,
    validateIDProofs, validateAddresses
} from '../../../utils/validations';

const AddAccount = () => {
    const history = useHistory()
    const [corporate, setCorporate] = useState(true)
    const [corporateValues, setCorporateValues] = useState({ referredBy: USERNAME, registeredDate: TODAYDATE })
    const [generalValues, setGeneralValues] = useState({ referredBy: USERNAME, registeredDate: TODAYDATE })
    const [deliveryValues, setDeliveryValues] = useState({})
    const [IDProofs, setIDProofs] = useState({})
    const [devDays, setDevDays] = useState([])
    const [addresses, setAddresses] = useState([])
    const hasExtraAddress = !!addresses.length
    const [routes, setRoutes] = useState([])
    const routeOptions = useMemo(() => getRouteOptions(routes), [routes])

    const highlight = { backgroundColor: '#5C63AB', color: '#fff' }
    const fade = { backgroundColor: '#EBEBEB', color: '#1B2125' }

    useEffect(() => {
        getRoutes()
        sessionStorage.removeItem('address0')
        sessionStorage.removeItem('address1')
        sessionStorage.removeItem('address2')
        sessionStorage.removeItem('address3')
        sessionStorage.removeItem('address4')
    }, [])

    useEffect(() => {
        resetCorporateValues()
        resetGeneralValues()
        resetDeliveryValues()
    }, [corporate])

    const getRoutes = async () => {
        try {
            const data = await http.GET('/warehouse/getroutes')
            setRoutes(data)
        } catch (ex) { }
    }

    const handleDeliveryValues = (value, key) => {
        setDeliveryValues(data => ({ ...data, [key]: value }))
    }
    const handleGeneralValues = (value, key) => {
        setGeneralValues(data => ({ ...data, [key]: value }))
    }
    const handleCorporateChange = (value, key) => {
        setCorporateValues(data => ({ ...data, [key]: value }))
    }

    const handleDevDaysSelect = (value) => {
        const clone = [...devDays]
        clone.push(value)
        setDevDays(clone)
    }

    const handleDevDaysDeselect = (value) => {
        const filtered = devDays.filter(day => day !== value)
        setDevDays(filtered)
    }

    const handleProofUpload = (file, name) => {
        getBase64(file, async (buffer) => {
            if (name === 'gstProof') {
                if (corporate) setCorporateValues(data => ({ ...data, [name]: buffer }))
                else setGeneralValues(data => ({ ...data, [name]: buffer }))
            }
            else if (name === 'idProofs') {
                const clone = { ...IDProofs }
                const { Front } = clone
                if (Front) clone.Back = buffer
                else clone.Front = buffer
                setIDProofs(clone)
            }
        })
    }

    const handleAddDelivery = () => {
        const limit = 5

        if (addresses.length < limit) {
            const address = { ...deliveryValues, devDays, isNew: true }
            // Validate delivery form values

            const clone = deepClone(addresses)
            clone.push(address)
            setAddresses(clone)
            resetDeliveryValues()
        }
    }

    const resetCorporateValues = () => {
        const defaultValues = {
            gstNo: '', natureOfBussiness: undefined, organizationName: '', address: '', customerName: '',
            mobileNumber: '', invoicetype: undefined, creditPeriodInDays: undefined, EmailId: '',
            referredBy: USERNAME, idProofType: undefined, registeredDate: TODAYDATE, gstProof: ''
        }
        setCorporateValues(defaultValues)
        setIDProofs({})
    }

    const resetGeneralValues = () => {
        const defaultValues = {
            depositAmount: '', gstNo: '', address: '', customerName: '', mobileNumber: '',
            invoicetype: undefined, EmailId: '', referredBy: USERNAME, idProofType: undefined,
            registeredDate: TODAYDATE, gstProof: ''
        }
        setGeneralValues(defaultValues)
        setIDProofs({})
        setDevDays([])
    }

    const resetDeliveryValues = () => {
        const defaultValues = {
            gstNo: '', depositAmount: '', routingId: undefined,
            phoneNumber: '', contactPerson: '', address: '', deliveryLocation: '',
            product20L: '', price20L: '', product1L: '', price1L: '', product500ML: '', price500ML: ''
        }
        setDeliveryValues(defaultValues)
        setDevDays([])
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

    const handleCreateAccount = async () => {
        let body;

        const IDProofError = validateIDProofs(IDProofs)
        const devDaysError = validateDevDays(devDays)
        if (IDProofError || devDaysError) return

        const idProofs = getIdProofsForDB(IDProofs)
        const deliveryDays = getDevDaysForDB(devDays)

        const extra = {
            customertype: corporate ? 'Corporate' : 'General',
            createdBy: USERID, departmentId: WAREHOUSEID
        }

        if (corporate) {
            const sessionAddresses = getSessionAddresses()

            const accountErrors = validateAccountValues(corporateValues, 'corporate')
            const deliveryErrors = validateDeliveryValues(deliveryValues)
            const extraDeliveryErrors = validateAddresses(sessionAddresses)

            const currentDelivery = { ...deliveryValues, devDays, isNew: true }
            const allDeliveries = [...sessionAddresses, currentDelivery]

            if (accountErrors || deliveryErrors || extraDeliveryErrors) return
            const Address1 = corporateValues.address
            delete corporateValues.address
            const delivery = getAddressesForDB(allDeliveries)
            const account = { ...corporateValues, Address1, idProofs, ...extra }
            body = { ...account, deliveryDetails: delivery }
        }
        else {
            const accountErrors = validateAccountValues(generalValues, 'general')

            if (accountErrors) return
            const products = getProductsForDB(generalValues)
            const delivery = { ...extractGADeliveryDetails(generalValues), deliveryDays, products }
            const account = extractGADetails(generalValues)
            body = { ...account, idProofs, deliveryDetails: [delivery], ...extra }
        }

        const url = '/customer/createCustomer'
        try {
            message.loading('Adding customer...', 0)
            await http.POST(url, { ...body, isActive: 0 })
            message.success('Customer added successfully!')
            history.push('/manage-accounts')
        } catch (error) {

        }
    }

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
                            data={corporateValues}
                            IDProofs={IDProofs}
                            onUpload={handleProofUpload}
                            onChange={handleCorporateChange}
                        />
                    ) : (
                            <GeneralAccount
                                data={generalValues}
                                devDays={devDays}
                                IDProofs={IDProofs}
                                onUpload={handleProofUpload}
                                onChange={handleGeneralValues}
                                onSelect={handleDevDaysSelect}
                                onDeselect={handleDevDaysDeselect}
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
                                {hasExtraAddress && <CustomButton onClick={handleAddDelivery} text='Add New' className='app-add-new-btn' icon={<PlusOutlined />} />}
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
                                                    uniqueId={index}
                                                    data={item}
                                                    routeOptions={routeOptions}
                                                />
                                            </Panel>
                                        </Collapse>
                                    )
                                })
                            }
                            <Delivery
                                devDays={devDays}
                                data={deliveryValues}
                                routeOptions={routeOptions}
                                hasExtraAddress={hasExtraAddress}
                                onAdd={handleAddDelivery}
                                onChange={handleDeliveryValues}
                                onSelect={handleDevDaysSelect}
                                onDeselect={handleDevDaysDeselect}
                            />
                        </>
                    ) : null
                }
                <div className='app-footer-buttons-container'>
                    <CustomButton
                        className='app-cancel-btn footer-btn'
                        text='Cancel'
                    />
                    <CustomButton
                        onClick={handleCreateAccount}
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
