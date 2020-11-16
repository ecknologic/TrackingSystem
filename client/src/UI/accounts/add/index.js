import { useHistory } from 'react-router-dom';
import { Divider, Checkbox, Collapse, message } from 'antd';
import React, { Fragment, useEffect, useMemo, useState, useCallback } from 'react';
import { DDownIcon, PlusIcon } from '../../../components/SVG_Icons'
import Header from './header';
import Delivery from './forms/Delivery';
import CustomButton from '../../../components/CustomButton';
import CorporateAccount from './forms/CorporateAccount';
import GeneralAccount from './forms/GeneralAccount';
import CollapseForm from './forms/CollapseForm';
import { http } from '../../../modules/http'
import { getRouteOptions } from '../../../assets/fixtures';
import {
    getBase64, deepClone, getIdProofsForDB, getDevDaysForDB, getAddressesForDB, resetTrackForm,
    getProductsForDB, extractGADeliveryDetails, extractGADetails, isEmpty, trackAccountFormOnce, getIDInputValidationProps, validateAadhar, validatePAN, isNumber
} from '../../../utils/Functions';
import { TRACKFORM, getUserId, getUsername, getWarehoseId, TODAYDATE } from '../../../utils/constants';
import {
    validateAccountValues, validateDeliveryValues, validateDevDays,
    validateIDProofs, validateAddresses
} from '../../../utils/validations';
import SuccessModal from '../../../components/CustomModal';
import QuitModal from '../../../components/CustomModal';
import SwitchModal from '../../../components/CustomModal';
import SuccessMessage from '../../../components/SuccessMessage';
import ConfirmMessage from '../../../components/ConfirmMessage';
import CollapseHeader from '../../../components/CollapseHeader';

const AddAccount = () => {
    const USERID = getUserId()
    const USERNAME = getUsername()
    const WAREHOUSEID = getWarehoseId()
    const history = useHistory()
    const defaultValues = useMemo(() => ({ referredBy: USERNAME, registeredDate: TODAYDATE }), [])

    const [confirmModal, setConfirmModal] = useState(false)
    const [switchModal, setSwitchModal] = useState(false)
    const [successModal, setSucessModal] = useState(false)
    const [sameAddress, setSameAddress] = useState(false)
    const [corporate, setCorporate] = useState(true)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [corporateValues, setCorporateValues] = useState(defaultValues)
    const [corporateErrors, setCorporateErrors] = useState({})
    const [generalValues, setGeneralValues] = useState(defaultValues)
    const [deliveryValues, setDeliveryValues] = useState({})
    const [IDProofs, setIDProofs] = useState({})
    const [IDErrors, setIDErrors] = useState({})
    const [devDays, setDevDays] = useState([])
    const [addresses, setAddresses] = useState([])
    const hasExtraAddress = !!addresses.length
    const [routes, setRoutes] = useState([])
    const routeOptions = useMemo(() => getRouteOptions(routes), [routes])

    const customertype = corporate ? 'Corporate' : 'General'
    const confirmMsg = 'Changes you made may not be saved.'
    const { organizationName } = corporateValues
    const { customerName } = generalValues
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
        trackAccountFormOnce()
        return () => resetTrackForm()
    }, [corporate])

    useEffect(() => {
        if (sameAddress) setDDForSameAddress()
        else resetDDForSameAddress()
    }, [sameAddress])

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
        if (sameAddress) preFillDDForm(value, key)

        // Validations
        let error = ''
        if (key === 'panNo') {
            if (!value) error = 'Required'
            else if (String(value).length === 10) {
                const isValid = validatePAN(value)
                !isValid && (error = 'Invalid')
                isValid && (error = '')
            }
        }
        else if (key === 'adharNo') {
            if (!value) error = 'Required'
            else if (!isNumber(value)) {
                error = 'Enter digits only'
            }
            else if (String(value).length === 12) {
                const isValid = validateAadhar(value)
                !isValid && (error = 'Invalid')
                isValid && (error = '')
            }
        }
        setIDErrors({ [key]: error })
        // validateInput(value, key)
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

    const handleProofRemove = (name) => {
        if (name === 'gstProof') {
            if (corporate) setCorporateValues(data => ({ ...data, [name]: '' }))
            else setGeneralValues(data => ({ ...data, [name]: '' }))
        }
        else if (name === 'Front') setIDProofs(data => ({ ...data, Front: '' }))
        else if (name === 'Back') setIDProofs(data => ({ ...data, Back: '' }))
    }

    const handleAddDelivery = () => {
        const limit = 5

        if (addresses.length < limit) {
            const address = { ...deliveryValues, devDays, isNew: true }

            const deliveryErrors = validateDeliveryValues(deliveryValues)
            const devDaysError = validateDevDays(devDays)

            if (!isEmpty(deliveryErrors) || !isEmpty(devDaysError)) {
                console.log('deliveryErrors', deliveryErrors)
                console.log('devDaysError', devDaysError)
                message.error('Validation Error')
                return
            }

            const clone = deepClone(addresses)
            clone.push(address)
            setAddresses(clone)
            resetDeliveryValues()
        } else message.info('Draft Limit Reached')
    }

    const resetCorporateValues = () => {
        const defaultValues = { referredBy: USERNAME, registeredDate: TODAYDATE }
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

        if (!isEmpty(IDProofError) || !isEmpty(devDaysError)) {
            console.log('IDProofError', IDProofError)
            console.log('devDaysError', devDaysError)
            message.error('Validation Error')
            return
        }

        const idProofs = getIdProofsForDB(IDProofs)
        const deliveryDays = getDevDaysForDB(devDays)

        const extra = {
            customertype, createdBy: USERID, departmentId: WAREHOUSEID
        }

        if (corporate) {
            const sessionAddresses = getSessionAddresses()

            const accountErrors = validateAccountValues(corporateValues, 'Corporate')
            const deliveryErrors = validateDeliveryValues(deliveryValues)
            const extraDeliveryErrors = validateAddresses(sessionAddresses)

            const currentDelivery = { ...deliveryValues, devDays, isNew: true }
            const allDeliveries = [...sessionAddresses, currentDelivery]

            if (!isEmpty(accountErrors) || !isEmpty(deliveryErrors) || !isEmpty(extraDeliveryErrors)) {
                console.log('extraDeliveryErrors', extraDeliveryErrors)
                console.log('deliveryErrors', deliveryErrors)
                console.log('accountErrors', accountErrors)
                message.error('Validation Error')
                return
            }
            const Address1 = corporateValues.address
            const delivery = getAddressesForDB(allDeliveries)
            const account = { ...corporateValues, Address1, idProofs, ...extra }
            body = { ...account, deliveryDetails: delivery }
        }
        else {
            const accountErrors = validateAccountValues(generalValues)

            if (!isEmpty(accountErrors)) {
                console.log('accountErrors', accountErrors)
                message.error('Validation Error')
                return
            }
            const products = getProductsForDB(generalValues)
            const delivery = { ...extractGADeliveryDetails(generalValues), deliveryDays, products }
            const account = extractGADetails(generalValues)
            body = { ...account, idProofs, deliveryDetails: [delivery], isActive: 0, ...extra }
        }

        const url = '/customer/createCustomer'
        try {
            setBtnDisabled(true)
            message.loading('Adding customer...', 0)
            await http.POST(url, body)
            message.destroy()
            setSucessModal(true)
        } catch (error) {
            message.destroy()
            setBtnDisabled(false)
        }
    }

    const setDDForSameAddress = () => {
        const { gstNo, customerName: contactPerson,
            address, mobileNumber: phoneNumber } = corporateValues
        const prefill = { gstNo, address, contactPerson, phoneNumber }

        setDeliveryValues(data => ({ ...data, ...prefill }))
    }

    const resetDDForSameAddress = () => {
        const prefill = { gstNo: '', address: '', contactPerson: '', phoneNumber: '' }
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
        else setCorporate(!corporate)
    }

    const handleAddNewAccount = () => {
        setSucessModal(false)
        setBtnDisabled(false)
        setCorporateValues(defaultValues)
        setGeneralValues(defaultValues)
        setDeliveryValues({})
        setIDProofs({})
    }

    const onAccountCancel = useCallback(() => setConfirmModal(true), [])
    const handleSucessModalCancel = useCallback(() => { setSucessModal(false); goToManageAccounts() }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleSwitchModalCancel = useCallback(() => setSwitchModal(false), [])
    const handleSuccessModalOk = useCallback(() => { setSucessModal(false); goToManageAccounts() }, [])
    const handleConfirmModalOk = useCallback(() => { setConfirmModal(false); goToManageAccounts() }, [])
    const handleSwitchModalOk = useCallback(() => {
        setCorporate(!corporate)
        setSwitchModal(false)
        resetCorporateValues()
        resetGeneralValues()
        resetDeliveryValues()
        resetTrackForm()
    }, [corporate])


    const goToManageAccounts = () => history.push('/manage-accounts')

    return (
        <Fragment>
            <Header />
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
                        text='Other Customers' onClick={onGeneralBtnClick}
                    />
                </div>
                {
                    corporate ? (
                        <CorporateAccount
                            track
                            data={corporateValues}
                            IDErrors={IDErrors}
                            IDProofs={IDProofs}
                            onUpload={handleProofUpload}
                            onRemove={handleProofRemove}
                            onChange={handleCorporateChange}
                        />
                    ) : (
                            <GeneralAccount
                                track
                                data={generalValues}
                                devDays={devDays}
                                IDProofs={IDProofs}
                                routeOptions={routeOptions}
                                onUpload={handleProofUpload}
                                onRemove={handleProofRemove}
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
                                {hasExtraAddress && <CustomButton onClick={handleAddDelivery} text='Add New' className='app-add-new-btn' icon={<PlusIcon />} />}
                            </div>
                            {
                                hasExtraAddress && addresses.map((item, index) => {
                                    const { deliveryLocation, address } = item
                                    return (
                                        <Collapse
                                            accordion
                                            key={index}
                                            className='accordion-container'
                                            expandIcon={() => <DDownIcon />}
                                            expandIconPosition='right'
                                        >
                                            <Panel
                                                header={<CollapseHeader title={deliveryLocation} msg={address} />}
                                                forceRender
                                            >
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
                                track
                                devDays={devDays}
                                data={deliveryValues}
                                routeOptions={routeOptions}
                                hasExtraAddress={hasExtraAddress}
                                sameAddress={sameAddress}
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
                        onClick={onAccountCancel}
                        className='app-cancel-btn footer-btn'
                        text='Cancel'
                    />
                    <CustomButton
                        onClick={handleCreateAccount}
                        className={`app-create-btn footer-btn ${btnDisabled && 'disabled'}`}
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
                    type={customertype}
                    name={organizationName || customerName}
                />
            </SuccessModal>
            <QuitModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure to leave?'
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
