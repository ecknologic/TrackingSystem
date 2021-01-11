import dayjs from 'dayjs';
import { useHistory, useParams } from 'react-router-dom';
import { Checkbox, Collapse, message, Popconfirm } from 'antd';
import React, { Fragment, useEffect, useMemo, useState, useCallback } from 'react';
import Header from './header';
import AccountView from './views/Account';
import DeliveryView from './views/Delivery';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import CollapseForm from '../add/forms/CollapseForm';
import NoContent from '../../../components/NoContent';
import AccountForm from '../add/forms/CorporateAccount';
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
    const [accountLoading, setAccountLoading] = useState(true)
    const [addressesLoading, setAddressesLoading] = useState(true)
    const [addressIds, setAddressIds] = useState([])
    const [confirmModal, setConfirmModal] = useState(false)
    const [successModal, setSucessModal] = useState(false)
    const [accountErrors, setAccountErrors] = useState({})
    const [IDProofs, setIDProofs] = useState({})
    const [addresses, setAddresses] = useState([])
    const [addressesErrors, setAddressesErrors] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [warehouseList, setWarehouseList] = useState([])
    const [shake, setShake] = useState(false)
    const [saveDisabled, setSaveDisabled] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [isReviewed, setIsReviewed] = useState(false)
    const warehouseOptions = useMemo(() => getWarehouseOptions(warehouseList), [warehouseList])

    const confirmMsg = 'Changes you made may not be saved.'
    const { organizationName, customerId, customertype, customerName } = accountValues

    useEffect(() => {
        resetSessionItems('address')
        getAccount()
        getAddresses()
    }, [])

    const getAccount = async () => {
        const url = `/customer/getCustomerDetailsById/${accountId}`
        try {
            const { data: [data = {}] } = await http.GET(url)
            const { customerName, organizationName, customertype, gstProof, adharNo, panNo,
                idProof_frontside, idProof_backside, idProofType, Address1, registeredDate } = data

            setHeaderContent({
                title: organizationName || customerName,
                customertype
            })
            const gst = base64String(gstProof?.data)
            const Front = base64String(idProof_frontside?.data)
            const Back = base64String(idProof_backside?.data)

            const newData = {
                ...data, gstProof: gst, address: Address1,
                registeredDate: dayjs(registeredDate).format('YYYY-MM-DD'),
            }
            setIDProofs({ Front, Back, idProofType, adharNo, panNo })
            setAccountValues(newData)
            setAccountLoading(false)
        } catch (error) { }
    }

    const getAddresses = async () => {
        const url = `/customer/getCustomerDeliveryDetails/${accountId}`
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
            setAddressesLoading(false)
            setAddressIds(addressIds)
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
            setTimeout(() => setShake(false), 820)
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
            await Promise.all([p1, p2])
            setAddresses(sessionAddresses)
            showToast(options)
            resetTrackForm()
            setEditMode(false)
            setSaveDisabled(false)
        } catch (error) {
            message.destroy()
            setSaveDisabled(false)
        }
    }

    const updateCustomer = async (body) => {
        const url = '/customer/updateCustomer'
        return http.POST(url, body)
    }

    const updateAddresses = async (body) => {
        const url = '/customer/updateDeliveryDetails'
        return http.POST(url, body)
    }

    const handleAccountEdit = () => {
        getWarehouseList()
        setEditMode(true)
    }

    const handleAddressDraft = (isDraft, id) => {
        if (isDraft) {
            const ids = addressIds.filter((item) => item !== id)
            setAddressIds(ids)
        } else {
            const ids = [...addressIds]
            ids.push(id)
            setAddressIds(ids)
        }
    }

    const handleAddressDelete = async (id) => {
        const options = { item: 'Delivery details', v1Ing: 'Deleting', v2: 'deleted' }
        const url = `/customer/deleteDelivery/${id}`

        try {
            showToast({ ...options, action: 'loading' })
            await http.DELETE(url)
            const filtered = addresses.filter(item => item.deliveryDetailsId !== id)
            const ids = addressIds.filter((item) => item !== id)
            setAddressIds(ids)
            setAddresses(filtered)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const onAccountApprove = async () => {
        const options = { item: 'Customer', action: 'loading', v1Ing: 'Approving' }
        const url = `/customer/approveCustomer/${customerId}`
        const body = {
            deliveryDetailsIds: addressIds
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

    const genExtra = (id) => (
        editMode ? (
            <div className='extra-icons' onClick={e => e.stopPropagation()}>
                <Checkbox onChange={({ target: { checked } }) => handleAddressDraft(checked, id)}
                    className='cb-tiny cb-secondary'>
                    Draft
                    </Checkbox>
                <Popconfirm onConfirm={() => handleAddressDelete(id)}
                    title='Sure to delete?'
                    getTooltipContainer={() => document.getElementById('content')}
                >
                    <TrashIconLight className='trash' />
                </Popconfirm>
            </div>
        ) : null
    );

    const goToCustomers = () => history.push('/customers')

    return (
        <Fragment>
            <Header data={headerContent} onClick={handleBack} />
            <div className='account-approval-content'>
                <div className='heading-container'>
                    <span className='heading'>Business Information</span>
                </div>
                {
                    accountLoading ? <NoContent content={<Spinner />} />
                        : <>
                            <IDProofInfo data={IDProofs} />
                            {
                                editMode ? (
                                    <AccountForm
                                        data={accountValues}
                                        errors={accountErrors}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        hiddenItems={{ idHide: true, gstUploadHide: true }}
                                        disabledItems={{ gstDisable: true, referredByDisable: true }}
                                    />
                                ) : <AccountView data={accountValues} />
                            }
                        </>
                }
                <div className='heading-container'>
                    <span className='heading'>Delivery Details</span>
                    {
                        !addressesLoading &&
                        <span className='tail'>{`(${addresses.length} Locations)`}</span>
                    }
                </div>
                {
                    addressesLoading ? <NoContent content={<Spinner />} />
                        : <>
                            <Collapse
                                accordion
                                className='accordion-container'
                                expandIcon={({ isActive }) => isActive ? <DDownIcon className='rotate-180' /> : <DDownIcon className='app-trans' />}
                                expandIconPosition='right'
                            >
                                {
                                    addresses.map((item, index) => {
                                        const { deliveryLocation, address, deliveryDetailsId } = item

                                        return (
                                            <Panel
                                                header={<CollapseHeader
                                                    title={deliveryLocation}
                                                    msg={address}
                                                    extra={genExtra(deliveryDetailsId)}
                                                />}
                                                key={deliveryDetailsId}
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
                        </>
                }
                {
                    !accountLoading &&
                    !addressesLoading &&
                    (
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
                                        <div className='approval-buttons-container'>
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
                    )
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
