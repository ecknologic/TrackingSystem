import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { Divider, Checkbox, Collapse, message } from 'antd';
import React, { Fragment, useEffect, useMemo, useState, useCallback } from 'react';
import Header from './header';
import Delivery from './forms/Delivery';
import { http } from '../../../modules/http'
import CollapseForm from './forms/CollapseForm';
import ScrollUp from '../../../components/ScrollUp';
import GeneralAccount from './forms/GeneralAccount';
import QuitModal from '../../../components/CustomModal';
import CorporateAccount from './forms/CorporateAccount';
import SwitchModal from '../../../components/CustomModal';
import SuccessModal from '../../../components/CustomModal';
import CustomButton from '../../../components/CustomButton';
import ConfirmMessage from '../../../components/ConfirmMessage';
import SuccessMessage from '../../../components/SuccessMessage';
import CollapseHeader from '../../../components/CollapseHeader';
import { DDownIcon, PlusIcon } from '../../../components/SVG_Icons'
import { getRouteOptions, getWarehouseOptions, WEEKDAYS } from '../../../assets/fixtures';
import {
    getBase64, deepClone, getIdProofsForDB, getDevDaysForDB, getAddressesForDB, resetTrackForm,
    getProductsForDB, extractGADeliveryDetails, extractGADetails, isEmpty, showToast, extractCADetails, getMainPathname
} from '../../../utils/Functions';
import { TRACKFORM, getUserId, getUsername, getWarehoseId, TODAYDATE } from '../../../utils/constants';
import {
    validateAccountValues, validateDeliveryValues, validateDevDays,
    validateIDProofs, validateAddresses, validateIDNumbers, validateNames, validateNumber, validateMobileNumber, validateEmailId, validateIntFloat, compareMaxNumber, validatePinCode
} from '../../../utils/validations';

const AddAccount = () => {
    const USERID = getUserId()
    const USERNAME = getUsername()
    const WAREHOUSEID = getWarehoseId()
    const history = useHistory()
    const { pathname } = useLocation()
    const defaultValues = useMemo(() => ({ referredBy: USERNAME, registeredDate: TODAYDATE }), [])

    const [confirmModal, setConfirmModal] = useState(false)
    const [switchModal, setSwitchModal] = useState(false)
    const [successModal, setSucessModal] = useState(false)
    const [sameAddress, setSameAddress] = useState(false)
    const [corporate, setCorporate] = useState(true)
    const [corporateErrors, setCorporateErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [corporateValues, setCorporateValues] = useState(defaultValues)
    const [generalValues, setGeneralValues] = useState(defaultValues)
    const [generalErrors, setGeneralErrors] = useState({})
    const [deliveryValues, setDeliveryValues] = useState({})
    const [deliveryErrors, setDeliveryErrors] = useState({})
    const [IDProofs, setIDProofs] = useState({})
    const [IDProofErrors, setIDProofErrors] = useState({})
    const [devDays, setDevDays] = useState([])
    const [devDaysError, setDevDaysError] = useState({})
    const [addresses, setAddresses] = useState([])
    const [addressesErrors, setAddressesErrors] = useState({})
    const hasExtraAddress = !!addresses.length
    const [warehouseList, setWarehouseList] = useState([])
    const [routeList, setRouteList] = useState([])
    const [scrollDep, setScrollDep] = useState(false)
    const [createShake, setCreateShake] = useState(false)
    const [addShake, setAddShake] = useState(false)
    const [currentDepId, setCurrentDepId] = useState('')
    const warehouseOptions = useMemo(() => getWarehouseOptions(warehouseList), [warehouseList])
    const routeOptions = useMemo(() => getRouteOptions(routeList), [routeList])
    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])

    const customertype = corporate ? 'Corporate' : 'Individual'
    const confirmMsg = 'Changes you made may not be saved.'
    const hideBack = mainUrl === '/add-customer'
    const { organizationName } = corporateValues
    const { customerName } = generalValues
    const highlight = { backgroundColor: '#5C63AB', color: '#fff' }
    const fade = { backgroundColor: '#EBEBEB', color: '#1B2125' }
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getWarehouseList()
        sessionStorage.removeItem('address0')
        sessionStorage.removeItem('address1')
        sessionStorage.removeItem('address2')
        sessionStorage.removeItem('address3')
        sessionStorage.removeItem('address4')

        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        if (sameAddress) setDDForSameAddress()
        else resetDDForSameAddress()
    }, [sameAddress])

    const getWarehouseList = async () => {
        const url = '/bibo/getDepartmentsList?departmentType=warehouse'

        try {
            const data = await http.GET(axios, url, config)
            setWarehouseList(data)
        } catch (error) { }
    }

    const getRouteList = async (departmentId) => {
        const url = `/customer/getRoutes/${departmentId}`

        try {
            const data = await http.GET(axios, url, config)
            setRouteList(data)
            setCurrentDepId(departmentId)
        } catch (error) { }
    }

    const handleDeliveryValues = (value, key) => {
        setDeliveryValues(data => ({ ...data, [key]: value }))
        setDeliveryErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'departmentId') {
            setDeliveryValues(data => ({ ...data, routeId: null }))
            handleGetNewRouteList(value)
        }

        // Validations
        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value)
            setDeliveryErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value)
            setDeliveryErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'contactPerson') {
            const error = validateNames(value)
            setDeliveryErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value)
            setDeliveryErrors(errors => ({ ...errors, productNPrice: error }))
        }
        else if (key.includes('product')) {
            const error = validateNumber(value)
            setDeliveryErrors(errors => ({ ...errors, productNPrice: error }))
        }
    }
    const handleDeliveryBlur = (value, key) => {

        // Validations
        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value, true)
            setDeliveryErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setDeliveryErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value, true)
            setDeliveryErrors(errors => ({ ...errors, productNPrice: error }))
        }
    }
    const handleGeneralValues = (value, key) => {
        setGeneralValues(data => ({ ...data, [key]: value }))
        setGeneralErrors(errors => ({ ...errors, [key]: '' }))

        if (value === 'adharNo' || value === 'panNo' || value === 'licenseNo') {
            setGeneralValues(data => ({ ...data, [value]: '' }))
            setGeneralErrors(errors => ({ ...errors, [value]: '' }))
        }

        if (key === 'departmentId') {
            setGeneralValues(data => ({ ...data, routeId: null }))
            handleGetNewRouteList(value)
        }

        // Validations
        if (key === 'adharNo' || key === 'panNo' || key === 'gstNo' || key === 'licenseNo') {
            const error = validateIDNumbers(key, value)
            setGeneralErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value)
            setGeneralErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'depositAmount') {
            const error = validateNumber(value)
            setGeneralErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'creditPeriodInDays') {
            const error = compareMaxNumber(value, 90, 'days')
            setGeneralErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('product')) {
            const error = validateNumber(value)
            setGeneralErrors(errors => ({ ...errors, productNPrice: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value)
            setGeneralErrors(errors => ({ ...errors, productNPrice: error }))
        }
        else if (key === 'pinCode') {
            const error = validatePinCode(value)
            setGeneralErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleGeneralBlur = (value, key) => {

        // Validations
        if (key === 'adharNo' || key === 'panNo' || key === 'gstNo' || key === 'licenseNo') {
            const error = validateIDNumbers(key, value, true)
            setGeneralErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value, true)
            setGeneralErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'EmailId') {
            const error = validateEmailId(value)
            setGeneralErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value, true)
            setGeneralErrors(errors => ({ ...errors, productNPrice: error }))
        }
        else if (key === 'pinCode') {
            const error = validatePinCode(value, true)
            setGeneralErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleCorporateChange = (value, key) => {

        setCorporateValues(data => ({ ...data, [key]: value }))
        setCorporateErrors(errors => ({ ...errors, [key]: '' }))
        if (sameAddress) preFillDDForm(value, key)

        // Validations
        if (key === 'gstNo' || key === 'licenseNo' || key === 'rocNo') {
            const error = validateIDNumbers(key, value)
            setCorporateErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'referredBy') {
            const error = validateNames(value)
            setCorporateErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'depositAmount' || key === 'poNo') {
            const error = validateNumber(value)
            setCorporateErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value)
            setCorporateErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'creditPeriodInDays') {
            const error = compareMaxNumber(value, 90, 'days')
            setCorporateErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'pinCode') {
            const error = validatePinCode(value)
            setCorporateErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleCorporateBlur = (value, key) => {

        // Validations
        if (key === 'gstNo' || key === 'licenseNo' || key === 'rocNo') {
            const error = validateIDNumbers(key, value, true)
            setCorporateErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value, true)
            setCorporateErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'EmailId') {
            const error = validateEmailId(value)
            setCorporateErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'pinCode') {
            const error = validatePinCode(value, true)
            setCorporateErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleDevDaysSelect = (value) => {
        setDevDaysError({ devDays: '' })
        if (value == 'ALL') setDevDays(WEEKDAYS)
        else {
            const clone = [...devDays]
            clone.push(value)
            if (clone.length === 7) clone.push('ALL')
            setDevDays(clone)
        }
    }

    const handleDevDaysDeselect = (value) => {
        if (value == 'ALL') setDevDays([])
        else {
            const filtered = devDays.filter(day => day !== value && day !== "ALL")
            setDevDays(filtered)
        }
    }

    const handleProofUpload = (file, name, formType) => {
        getBase64(file, async (buffer) => {
            if (name === 'gstProof') {
                if (formType === 'delivery') {
                    setDeliveryValues(data => ({ ...data, [name]: buffer }))
                    setDeliveryErrors(errors => ({ ...errors, [name]: '' }))
                }
                else if (corporate) {
                    setCorporateValues(data => ({ ...data, [name]: buffer }))
                    setCorporateErrors(errors => ({ ...errors, [name]: '' }))
                    if (sameAddress) preFillDDForm(buffer, name)
                }
                else {
                    setGeneralValues(data => ({ ...data, [name]: buffer }))
                    setGeneralErrors(errors => ({ ...errors, [name]: '' }))
                }
            }
            else if (name === 'idProofs') {
                const clone = { ...IDProofs }
                const { Front } = clone
                if (Front) {
                    clone.Back = buffer
                    setIDProofErrors(errors => ({ ...errors, Back: '' }))
                }
                else {
                    clone.Front = buffer
                    setIDProofErrors(errors => ({ ...errors, Front: '' }))
                }
                setIDProofs(clone)
            }
            else if (name === 'Front' || name === 'Back') {
                setIDProofErrors(errors => ({ ...errors, [name]: '' }))
                const clone = { ...IDProofs }
                clone[name] = buffer
                setIDProofs(clone)
            }
        })
    }

    const handleProofRemove = (name, formType) => {
        if (name === 'gstProof') {
            if (formType === 'delivery') setDeliveryValues(data => ({ ...data, [name]: '' }))
            else if (corporate) setCorporateValues(data => ({ ...data, [name]: '' }))
            else setGeneralValues(data => ({ ...data, [name]: '' }))
        }
        else if (name === 'Front') setIDProofs(data => ({ ...data, Front: '' }))
        else if (name === 'Back') setIDProofs(data => ({ ...data, Back: '' }))
    }

    const handleGetNewRouteList = (depId) => {
        if (currentDepId !== depId) {
            getRouteList(depId)
        }
    }

    const handleAddDelivery = () => {
        const limit = 4

        if (addresses.length < limit) {
            const address = { ...deliveryValues, devDays, isNew: true }

            const errors = validateDeliveryValues(deliveryValues)
            const devDaysError = validateDevDays(devDays)

            if (!isEmpty(errors) || !isEmpty(devDaysError)) {
                setAddShake(true)
                setTimeout(() => setAddShake(false), 820)
                setDeliveryErrors({ ...errors })
                setDevDaysError({ ...devDaysError })
                return
            }

            const clone = deepClone(addresses)
            clone.push(address)
            setAddresses(clone)
            resetDeliveryValues()
        } else message.info('Max limit reached. You can add more from Manage Accounts later')
    }

    const resetCorporateValues = () => {
        setCorporateValues(defaultValues)
        setIDProofs({})
    }

    const resetGeneralValues = () => {
        setGeneralValues(defaultValues)
        setIDProofs({})
        setDevDays([])
    }

    const resetDeliveryValues = () => {
        setDeliveryValues({})
        setDevDays([])
    }

    const resetErrorValues = () => {
        setCorporateErrors({})
        setGeneralErrors({})
        setDeliveryErrors({})
        setIDProofErrors({})
        setDevDaysError({})
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

        const { idProofType } = corporate ? corporateValues : generalValues
        const IDProofError = validateIDProofs(IDProofs, idProofType)

        const extra = {
            customertype, createdBy: USERID, departmentId: WAREHOUSEID
        }

        if (corporate) {
            const sessionAddresses = getSessionAddresses()

            const accountErrors = validateAccountValues(corporateValues, 'Corporate')
            const deliveryErrors = validateDeliveryValues(deliveryValues)
            const devDaysError = validateDevDays(devDays)
            const extraDeliveryErrors = validateAddresses(sessionAddresses)

            const currentDelivery = { ...deliveryValues, devDays, isNew: true }
            const allDeliveries = [...sessionAddresses, currentDelivery]

            if (!isEmpty(accountErrors) || !isEmpty(deliveryErrors)
                || !isEmpty(IDProofError) || !isEmpty(extraDeliveryErrors) || !isEmpty(devDaysError)) {
                setCreateShake(true)
                setTimeout(() => setCreateShake(false), 820)
                setIDProofErrors(IDProofError)
                setDevDaysError(devDaysError)
                setDeliveryErrors(deliveryErrors)
                setAddressesErrors(extraDeliveryErrors)
                setCorporateErrors(accountErrors)
                return
            }
            const idProofs = getIdProofsForDB(IDProofs, idProofType)
            const delivery = getAddressesForDB(allDeliveries)
            const account = extractCADetails(corporateValues)
            body = { ...account, deliveryDetails: delivery, idProofs, ...extra }
        }
        else {

            const accountErrors = validateAccountValues(generalValues)
            const devDaysError = validateDevDays(devDays)

            if (!isEmpty(accountErrors) || !isEmpty(devDaysError) || !isEmpty(IDProofError)) {
                setCreateShake(true)
                setTimeout(() => setCreateShake(false), 820)
                setIDProofErrors(IDProofError)
                setDevDaysError(devDaysError)
                setGeneralErrors(accountErrors)
                return
            }
            const idProofs = getIdProofsForDB(IDProofs)
            const deliveryDays = getDevDaysForDB(devDays)
            const products = getProductsForDB(generalValues)
            const delivery = { ...extractGADeliveryDetails(generalValues), deliveryDays, products }
            const account = extractGADetails(generalValues)
            body = { ...account, idProofs, deliveryDetails: [delivery], isApproved: 0, ...extra }
        }

        const options = { item: 'Customer', action: 'loading', v1Ing: 'Adding' }
        const url = '/customer/createCustomer'
        try {
            setBtnDisabled(true)
            showToast(options)
            await http.POST(axios, url, body, config)
            message.destroy()
            setSucessModal(true)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const setDDForSameAddress = () => {
        const { gstNo, customerName: contactPerson,
            address, mobileNumber: phoneNumber, gstProof } = corporateValues
        const prefill = { gstNo, address, contactPerson, phoneNumber, gstProof }

        setDeliveryValues(data => ({ ...data, ...prefill }))
    }

    const resetDDForSameAddress = () => {
        const prefill = { gstNo: '', address: '', contactPerson: '', phoneNumber: '', gstProof: '' }
        setDeliveryValues(data => ({ ...data, ...prefill }))
    }

    const preFillDDForm = (value, key) => {
        let newKey = key
        if (key === 'customerName') newKey = 'contactPerson'
        else if (key === 'mobileNumber') newKey = 'phoneNumber'
        setDeliveryValues(data => ({ ...data, [newKey]: value }))
    }
    const onCorporateBtnClick = () => {
        if (!corporate) handleSwitchAccount()
    }
    const onGeneralBtnClick = () => {
        if (corporate) handleSwitchAccount()
    }
    const handleSwitchAccount = () => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged) setSwitchModal(true)
        else {
            setCorporate(!corporate)
            setCorporateValues({ ...defaultValues, natureOfBussiness: null })
            setGeneralValues({ ...defaultValues, natureOfBussiness: 'Residential' })
            resetErrorValues()
        }
    }

    const handleAddNewAccount = () => {
        setSucessModal(false)
        setBtnDisabled(false)
        setCorporateValues(defaultValues)
        setGeneralValues(defaultValues)
        setDeliveryValues({})
        setIDProofs({})
        setDevDays([])
        setAddresses([])
        setSameAddress(false)
        resetTrackForm()
        setScrollDep(!scrollDep)
    }

    const onAccountCancel = useCallback(() => setConfirmModal(true), [])
    const handleSucessModalCancel = useCallback(() => { setSucessModal(false); goBack() }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleSwitchModalCancel = useCallback(() => setSwitchModal(false), [])
    const handleSuccessModalOk = useCallback(() => { setSucessModal(false); goBack() }, [])
    const handleConfirmModalOk = useCallback(() => { setConfirmModal(false); goBack() }, [])
    const handleSwitchModalOk = useCallback(() => {
        setCorporate(!corporate)
        setSwitchModal(false)
        resetCorporateValues()
        setAddresses([])
        resetGeneralValues()
        resetErrorValues()
        resetDeliveryValues()
        resetTrackForm()
    }, [corporate])

    const handleBack = () => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged) {
            setConfirmModal(true)
        }
        else goBack()
    }

    const goBack = () => {
        if (mainUrl === '/add-customer') history.push('/manage-accounts')
        else history.push(mainUrl)
    }

    return (
        <Fragment>
            <ScrollUp dep={scrollDep} />
            <Header onClick={handleBack} hideBack={hideBack} />
            <div className='account-add-content'>
                <div className='header-buttons-container'>
                    <CustomButton
                        className='big'
                        style={corporate ? highlight : fade}
                        text='Corporate Customers' onClick={onCorporateBtnClick}
                    />
                    <CustomButton
                        className='big second'
                        style={corporate ? fade : highlight}
                        text='Individual Customers' onClick={onGeneralBtnClick}
                    />
                </div>
                {
                    corporate ? (
                        <CorporateAccount
                            data={corporateValues}
                            errors={corporateErrors}
                            IDProofs={IDProofs}
                            IDProofErrors={IDProofErrors}
                            onUpload={handleProofUpload}
                            onRemove={handleProofRemove}
                            onChange={handleCorporateChange}
                            onBlur={handleCorporateBlur}
                        />
                    ) : (
                        <GeneralAccount
                            data={generalValues}
                            errors={generalErrors}
                            devDays={devDays}
                            devDaysError={devDaysError}
                            IDProofs={IDProofs}
                            IDProofErrors={IDProofErrors}
                            routeOptions={routeOptions}
                            warehouseOptions={warehouseOptions}
                            onUpload={handleProofUpload}
                            onRemove={handleProofRemove}
                            onBlur={handleGeneralBlur}
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
                                <Checkbox disabled={sameAddress && hasExtraAddress} checked={sameAddress} onChange={() => setSameAddress(!sameAddress)} />
                                <span className='text'>Delivery to the same address?</span>
                            </div>
                            <Divider />
                            <div className='title-container'>
                                <span className='title'>Delivery Details</span>
                                {hasExtraAddress && <CustomButton onClick={handleAddDelivery} text='Add New' className={`app-add-new-btn ${addShake ? 'app-shake' : ''}`} icon={<PlusIcon />} />}
                            </div>
                            {
                                hasExtraAddress && <Collapse
                                    accordion
                                    className='accordion-container'
                                    expandIcon={({ isApproved }) => isApproved ? <DDownIcon className='rotate-180' /> : <DDownIcon className='app-trans' />}
                                    expandIconPosition='right'
                                >
                                    {
                                        addresses.map((item, index) => {
                                            const { deliveryLocation, address } = item

                                            return (
                                                <Panel
                                                    key={index}
                                                    header={<CollapseHeader title={deliveryLocation} msg={address} />}
                                                    forceRender
                                                >
                                                    <CollapseForm
                                                        uniqueId={index}
                                                        data={item}
                                                        addressesErrors={addressesErrors}
                                                        warehouseOptions={warehouseOptions}
                                                    />
                                                </Panel>
                                            )
                                        })
                                    }

                                </Collapse>
                            }
                            <Delivery
                                devDays={devDays}
                                devDaysError={devDaysError}
                                data={deliveryValues}
                                errors={deliveryErrors}
                                routeOptions={routeOptions}
                                warehouseOptions={warehouseOptions}
                                sameAddress={sameAddress && !hasExtraAddress}
                                onRemove={handleProofRemove}
                                onUpload={handleProofUpload}
                                onChange={handleDeliveryValues}
                                onBlur={handleDeliveryBlur}
                                onSelect={handleDevDaysSelect}
                                onDeselect={handleDevDaysDeselect}
                            />
                            {
                                !hasExtraAddress && (
                                    <div className='row add-new-btn-container'>
                                        <CustomButton text='Add New' onClick={handleAddDelivery} className={`app-add-new-btn ${addShake ? 'app-shake' : ''}`} icon={<PlusIcon />} />
                                    </div>
                                )
                            }
                        </>
                    ) : null
                }
                <div className='app-footer-buttons-container'>
                    <CustomButton
                        onClick={onAccountCancel}
                        className='app-cancel-btn footer-btn'
                        text='Cancel'
                    />
                    <CustomButton
                        onClick={handleCreateAccount}
                        className={`
                        app-create-btn footer-btn ${btnDisabled && 'disabled'}
                        ${createShake && 'app-shake'}
                        `}
                        text='Create Account'
                    />
                </div>
            </div>
            <SuccessModal
                visible={successModal}
                onOk={handleSuccessModalOk}
                onOther={handleAddNewAccount}
                onCancel={handleSucessModalCancel}
                title='Account Confirmation'
                okTxt='Continue'
                cancelTxt='Add New'
            >
                <SuccessMessage
                    action={`added ${customertype === 'Corporate' ? 'a' : 'an'}`}
                    type={customertype}
                    name={organizationName || customerName}
                />
            </SuccessModal>
            <QuitModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg={confirmMsg} />
            </QuitModal>
            <SwitchModal
                visible={switchModal}
                onOk={handleSwitchModalOk}
                onCancel={handleSwitchModalCancel}
                title='Are you sure to change customer type?'
                okTxt='Yes'
            >
                <ConfirmMessage msg={confirmMsg} />
            </SwitchModal>
        </Fragment>
    )
}
const { Panel } = Collapse
export default AddAccount
