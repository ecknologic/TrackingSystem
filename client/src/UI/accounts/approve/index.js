import dayjs from 'dayjs';
import { useHistory, useParams } from 'react-router-dom';
import { Checkbox, Collapse, message, Popconfirm } from 'antd';
import React, { Fragment, useEffect, useMemo, useState, useCallback } from 'react';
import Header from './header';
import AccountView from './views/Account';
import DeliveryView from './views/Delivery';
import { http } from '../../../modules/http'
import ApprovalForm from './forms/ApprovalForm';
import Spinner from '../../../components/Spinner';
import ScrollUp from '../../../components/ScrollUp';
import CollapseForm from '../add/forms/CollapseForm';
import NoContent from '../../../components/NoContent';
import QuitModal from '../../../components/CustomModal';
import IDProofInfo from '../../../components/IDProofInfo';
import SuccessModal from '../../../components/CustomModal';
import CustomButton from '../../../components/CustomButton';
import ConfirmMessage from '../../../components/ConfirmMessage';
import SuccessMessage from '../../../components/SuccessMessage';
import CollapseHeader from '../../../components/CollapseHeader';
import { getWarehouseOptions } from '../../../assets/fixtures';
import { DDownIcon, TrashIconLight } from '../../../components/SVG_Icons'
import {
    getIdProofsForDB, getAddressesForDB, isEmpty, showToast, extractCADetails, base64String, getDevDays,
    getProductsForUI, resetSessionItems, getSessionItems, resetTrackForm
} from '../../../utils/Functions';
import { TRACKFORM } from '../../../utils/constants';
import {
    validateAccountValues, validateAddresses, validateIDNumbers, validateNames, validateNumber,
    validateMobileNumber, validateEmailId
} from '../../../utils/validations';

const ApproveAccount = () => {
    const { accountId } = useParams()
    const history = useHistory()
    const [accountValues, setAccountValues] = useState({ loading: true })
    const [headerContent, setHeaderContent] = useState({})
    const [loading, setLoading] = useState(true)
    const [activeAddressIds, setActiveAddressIds] = useState([])
    const [removedAddressIds, setRemovedAddressIds] = useState([])
    const [confirmModal, setConfirmModal] = useState(false)
    const [successModal, setSucessModal] = useState(false)
    const [accountErrors, setAccountErrors] = useState({})
    const [IDProofs, setIDProofs] = useState({})
    const [gstProof, setGstProof] = useState({})
    const [addresses, setAddresses] = useState([])
    const [addressesErrors, setAddressesErrors] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [warehouseList, setWarehouseList] = useState([])
    const [shake, setShake] = useState(false)
    const [saveDisabled, setSaveDisabled] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [isReviewed, setIsReviewed] = useState(false)
    const [activeKey, setActiveKey] = useState()
    const warehouseOptions = useMemo(() => getWarehouseOptions(warehouseList), [warehouseList])

    const confirmMsg = 'Changes you made may not be saved.'
    const showTrashIcon = useMemo(() => addresses.length !== 1, [addresses.length])
    const { organizationName, customerId, customertype, customerName } = accountValues

    useEffect(() => {
        resetSessionItems('address')
        const p1 = getAccount()
        const p2 = getAddresses()
        Promise.all([p1, p2]).then(() => setLoading(false))
    }, [])

    const getAccount = async () => {
        const url = `/customer/getCustomerDetailsById/${accountId}`
        try {
            const { data: [data = {}] } = await http.GET(url)
            const { gstProof, idProof_frontside, idProof_backside, Address1, registeredDate, ...rest } = data
            const { customerName, organizationName, customertype, gstNo, adharNo, panNo, idProofType } = rest

            setHeaderContent({
                title: organizationName || customerName,
                customertype
            })
            const gst = base64String(gstProof?.data)
            const Front = base64String(idProof_frontside?.data)
            const Back = base64String(idProof_backside?.data)

            const newData = {
                ...rest, gstProof: gst, address: Address1,
                registeredDate: dayjs(registeredDate).format('YYYY-MM-DD'),
            }
            setIDProofs({ Front, Back, idProofType, adharNo, panNo })
            setGstProof({ Front: gst, idProofType: 'gstNo', gstNo })
            setAccountValues(newData)
            return Promise.resolve()
        } catch (error) { }
    }

    const getAddresses = async () => {
        const url = `/customer/getCustomerDeliveryDetails/${accountId}?isSuperAdmin=true`
        try {
            const { data: [data = {}] } = await http.GET(url)
            const { deliveryDetails = [] } = data
            const addressIds = []
            const deliveries = deliveryDetails.map((item) => {
                const { deliveryDays, products, gstProof, deliveryDetailsId } = item
                const gst = base64String(gstProof?.data)
                const devDays = getDevDays(deliveryDays)
                const productList = getProductsForUI(products)
                addressIds.push(deliveryDetailsId)
                return { ...item, devDays, gstProof: gst, ...productList }
            })
            setAddresses(deliveries)
            setActiveAddressIds(addressIds)
            return Promise.resolve()
        } catch (error) { }
    }

    const getWarehouseList = async () => {
        const data = await http.GET('/motherPlant/getDepartmentsList?departmentType=warehouse')
        setWarehouseList(data)
    }

    const handleChange = (value, key) => {
        setAccountValues(data => ({ ...data, [key]: value }))
        setAccountErrors(errors => ({ ...errors, [key]: '' }))

        if (value === 'adharNo' || value === 'panNo' || value === 'licenseNo') {
            setAccountValues(data => ({ ...data, [value]: '' }))
            setAccountErrors(errors => ({ ...errors, [value]: '' }))
        }

        // Validations
        if (key === 'adharNo' || key === 'panNo' || key === 'gstNo' || key === 'licenseNo') {
            const error = validateIDNumbers(key, value)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'organizationName' || key === 'customerName' || key === 'referredBy') {
            const error = validateNames(value)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'creditPeriodInDays') {
            const error = validateNumber(value)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {

        // Validations
        if (key === 'adharNo' || key === 'panNo' || key === 'gstNo' || key === 'licenseNo') {
            const error = validateIDNumbers(key, value, true)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value, true)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'EmailId') {
            const error = validateEmailId(value)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleAccountSave = async () => {
        const { idProofType } = accountValues
        const sessionAddresses = getSessionItems('address')

        const accountErrors = validateAccountValues(accountValues, customertype, true)
        const addressErrors = validateAddresses(sessionAddresses)

        if (!isEmpty(accountErrors) || !isEmpty(addressErrors)) {
            setShake(true)
            setTimeout(() => {
                setShake(false)
                const { key } = addressErrors
                if (key) setActiveKey(key) // opens accordion on error
            }, 820)
            setAddressesErrors(addressErrors)
            setAccountErrors(accountErrors)
            return
        }
        const idProofs = getIdProofsForDB(IDProofs, idProofType)
        const delivery = getAddressesForDB(sessionAddresses, true)
        const account = { ...extractCADetails(accountValues), idProofs }
        const options = { item: 'Customer', v1Ing: 'Saving', v2: 'saved' }

        try {
            setSaveDisabled(true)
            showToast({ ...options, action: 'loading' })
            const p1 = updateCustomer(account)
            const p2 = updateAddresses(delivery)
            const p3 = deleteAddresses()
            await Promise.all([p1, p2, p3])
            setAddresses(sessionAddresses)
            showToast(options)
            postAccountSave()
        } catch (error) {
            message.destroy()
            setSaveDisabled(false)
        }
    }

    const postAccountSave = () => {
        resetTrackForm()
        setEditMode(false)
        setSaveDisabled(false)
        setRemovedAddressIds([])
        setAddressesErrors({})
        setAccountErrors({})
    }

    const updateCustomer = async (body) => {
        try {
            const url = '/customer/updateCustomer'
            await http.POST(url, body)
            return Promise.resolve()
        } catch (error) {
            Promise.reject()
        }
    }

    const updateAddresses = async (deliveries) => {
        const body = deliveries.map(item => {
            // delete item.isApproved //should not send isApproved while update
            return item
        })

        try {
            const url = '/customer/updateDeliveryDetails'
            if (body.length) {
                await http.POST(url, body)
            }
            return Promise.resolve()
        } catch (error) {
            return Promise.reject()
        }
    }

    const deleteAddresses = async () => {
        try {
            const promises = []
            const total = removedAddressIds.length
            for (let index = 0; index < total; index++) {
                const id = removedAddressIds[index]
                const url = `/customer/deleteDelivery/${id}`
                promises.push(http.DELETE(url))
            }
            await Promise.all(promises)
            return Promise.resolve()
        } catch (error) {
            return Promise.reject()
        }
    }

    const handleAccountEdit = () => {
        getWarehouseList()
        const filtered = addresses.filter(item => item.isApproved === 1)
        setActiveAddressIds(filtered)
        setEditMode(true)
    }

    const handleAddressDraft = (isDraft, id) => {
        if (isDraft) {
            const ids = activeAddressIds.filter((item) => item !== id)
            setActiveAddressIds(ids)
        } else {
            const ids = [...activeAddressIds]
            ids.push(id)
            setActiveAddressIds(ids)
        }
        const sessionAddresses = getSessionItems('address')
        const index = sessionAddresses.findIndex((item) => item.deliveryDetailsId === id)
        const address = sessionAddresses[index]
        address.isApproved = Number(isDraft)
        setAddresses(sessionAddresses)
        sessionStorage.setItem(`address${index}`, JSON.stringify(address))
    }

    const onAddressDelete = (id, index) => {
        const filtered = addresses.filter(item => item.deliveryDetailsId !== id)
        const ids = activeAddressIds.filter((item) => item !== id)
        setActiveAddressIds(ids)
        setRemovedAddressIds(ids => ([...ids, id]))
        setAddresses(filtered)
        sessionStorage.removeItem(`address${index}`)
    }

    const onAccountApprove = async () => {
        const options = { item: 'Customer', action: 'loading', v1Ing: 'Approving' }
        const url = `/customer/approveCustomer/${customerId}`
        const body = {
            deliveryDetailsIds: activeAddressIds
        }
        try {
            setBtnDisabled(true)
            showToast(options)
            await http.POST(url, body)
            message.destroy()
            resetTrackForm()
            setSucessModal(true)
        } catch (error) {
            message.destroy()
            setBtnDisabled(false)
        }
    }

    const onAccountCancel = useCallback(() => setConfirmModal(true), [])
    const handleSucessModalCancel = useCallback(() => { setSucessModal(false); goToCustomers() }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleSuccessModalOk = useCallback(() => { setSucessModal(false); history.replace('/customers') }, [])
    const handleConfirmModalOk = useCallback(() => { setConfirmModal(false); goToCustomers() }, [])

    const handleBack = () => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged) {
            setConfirmModal(true)
        }
        else goToCustomers()
    }

    const genExtra = (id, isApproved, index) => (
        editMode ? (
            <div className='extra-icons' onClick={e => e.stopPropagation()}>
                <Checkbox checked={isApproved} onChange={({ target: { checked } }) => handleAddressDraft(checked, id)}
                    className='cb-tiny cb-secondary'>
                    Draft
                    </Checkbox>
                {
                    showTrashIcon && (
                        <Popconfirm onConfirm={() => onAddressDelete(id, index)}
                            title='Sure to delete?'
                            getTooltipContainer={() => document.getElementById('content')}
                        >
                            <TrashIconLight className='trash' />
                        </Popconfirm>
                    )
                }
            </div>
        ) : null
    );

    const goToCustomers = () => history.push('/customers')

    return (
        <Fragment>
            <ScrollUp dep={editMode} />
            <Header data={headerContent} onClick={handleBack} />
            <div className='app-manage-content'>
                {
                    loading ? <NoContent content={<Spinner />} />
                        : <>
                            <div className='heading-container'>
                                <span className='heading'>Business Information</span>
                            </div>
                            {
                                editMode ? (
                                    <ApprovalForm
                                        data={accountValues}
                                        errors={accountErrors}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabledItems={{ gstDisable: gstProof.Front }}
                                    />
                                ) : <>
                                        <IDProofInfo data={IDProofs} />
                                        <IDProofInfo data={gstProof} />
                                        <AccountView data={accountValues} />
                                    </>
                            }
                            <div className='heading-container'>
                                <span className='heading'>Delivery Details</span>
                                <span className='tail'>{`(${addresses.length} Locations)`}</span>
                            </div>
                            <Collapse
                                accordion
                                className='accordion-container'
                                expandIcon={({ isActive }) => isActive ? <DDownIcon className='rotate-180' /> : <DDownIcon className='app-trans' />}
                                expandIconPosition='right'
                                activeKey={activeKey}
                                onChange={(key) => setActiveKey(key)}
                            >
                                {
                                    addresses.map((item, index) => {
                                        const { deliveryLocation, address, isApproved, deliveryDetailsId: id } = item
                                        console.log('isApproved...', isApproved)
                                        return (
                                            <Panel
                                                header={<CollapseHeader
                                                    title={deliveryLocation}
                                                    msg={address}
                                                    extra={genExtra(id, Boolean(isApproved), index)}
                                                />}
                                                key={String(index)}
                                                forceRender
                                            >
                                                {
                                                    editMode ? (
                                                        <CollapseForm
                                                            uniqueId={index}
                                                            data={item}
                                                            addressesErrors={addressesErrors}
                                                            warehouseOptions={warehouseOptions}
                                                        />
                                                    ) : <DeliveryView data={item} />
                                                }
                                            </Panel>
                                        )
                                    })
                                }
                            </Collapse>
                            <div className='app-footer-buttons-container'>
                                <CustomButton
                                    onClick={onAccountCancel}
                                    className='app-cancel-btn footer-btn'
                                    text='Cancel'
                                />
                                {
                                    editMode ? (
                                        <CustomButton
                                            onClick={handleAccountSave}
                                            className={`
                                        app-create-btn footer-btn ${saveDisabled && 'disabled'}
                                        ${shake && 'app-shake'}
                                    `}
                                            text='Save'
                                        />
                                    ) : (
                                            <div className='multi-buttons-container'>
                                                <div className='check-confirm'>
                                                    <Checkbox onChange={({ target: { checked } }) => setIsReviewed(checked)} checked={isReviewed} />
                                                    <span className='text'>I reviewed the above details for customer onboarding.</span>
                                                </div>
                                                <CustomButton
                                                    onClick={handleAccountEdit}
                                                    className={`
                                                footer-btn ${btnDisabled && 'disabled'}
                                            `}
                                                    text='Edit'
                                                />
                                                <CustomButton
                                                    onClick={onAccountApprove}
                                                    className={`
                                                approve-btn footer-btn ${(!isReviewed || btnDisabled) && 'disabled'}
                                            `}
                                                    text='Approve'
                                                />
                                            </div>
                                        )
                                }
                            </div>
                        </>
                }
            </div>
            <SuccessModal
                visible={successModal}
                onOk={handleSuccessModalOk}
                onCancel={handleSucessModalCancel}
                title='Account Confirmation'
                okTxt='Continue'
            >
                <SuccessMessage
                    action={`approved ${customertype === 'Corporate' ? 'a' : 'an'}`}
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
        </Fragment>
    )
}
const { Panel } = Collapse
export default ApproveAccount
