import dayjs from 'dayjs';
import { message } from 'antd';
import { useLocation, useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { http } from '../../../../modules/http';
import Spinner from '../../../../components/Spinner';
import AccountView from '../../approve/views/Account';
import ScrollUp from '../../../../components/ScrollUp';
import NoContent from '../../../../components/NoContent';
import { TRACKFORM } from '../../../../utils/constants';
import IDProofInfo from '../../../../components/IDProofInfo';
import ConfirmModal from '../../../../components/CustomModal';
import CustomButton from '../../../../components/CustomButton';
import GeneralAccountForm from '../../add/forms/GeneralAccount';
import CorporateAccountForm from '../../add/forms/CorporateAccount';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import { base64String, extractCADetails, extractGADetails, getBase64, getIdProofsForDB, getMainPathname, isEmpty, resetTrackForm, showToast, trackAccountFormOnce } from '../../../../utils/Functions';
import { validateIDProofs, validateAccountValues, validateIDNumbers, validateMobileNumber, validateNames, validateEmailId, validateNumber } from '../../../../utils/validations';

const AccountOverview = ({ data, onUpdate, isSuperAdmin }) => {
    const { gstProof, idProof_backside, idProof_frontside, isApproved, registeredDate,
        customertype, Address1, loading, adharNo, idProofType, panNo, gstNo } = data

    const { pathname } = useLocation()
    const history = useHistory()
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [accountValues, setAccountValues] = useState({})
    const [accountErrors, setAccountErrors] = useState({})
    const [IDProofErrors, setIDProofErrors] = useState({})
    const [confirmModal, setConfirmModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [IDProofs, setIDProofs] = useState({})
    const [gstProofs, setGstProofs] = useState({})
    const [shake, setShake] = useState(false)

    useEffect(() => {
        if (!loading) {
            const gst = base64String(gstProof?.data)
            const Front = base64String(idProof_frontside?.data)
            const Back = base64String(idProof_backside?.data)

            const newData = {
                ...data, gstProof: gst, address: Address1,
                registeredDate: dayjs(registeredDate).format('YYYY-MM-DD')
            }
            setIDProofs({ Front, Back, idProofType, adharNo, panNo })
            setGstProofs({ Front: gst, idProofType: 'gstNo', gstNo })
            setAccountValues(newData)
        }
    }, [loading])

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => resetTrackForm()
    }, [])

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
        else if (key === 'referredBy') {
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

    const handleProofUpload = (file, name) => {
        getBase64(file, async (buffer) => {
            if (name === 'gstProof') {
                setAccountValues(data => ({ ...data, [name]: buffer }))
                setAccountErrors(errors => ({ ...errors, [name]: '' }))
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

    const handleProofRemove = (name) => {
        if (name === 'gstProof') setAccountValues(data => ({ ...data, [name]: '' }))
        else if (name === 'Front') setIDProofs(data => ({ ...data, Front: '' }))
        else if (name === 'Back') setIDProofs(data => ({ ...data, Back: '' }))
    }

    const handleAccountEdit = () => {
        setEditMode(true)
    }

    const renderFooter = () => {
        return (<div className={`app-footer-buttons-container ${editMode ? 'edit' : 'view'}`}>
            <CustomButton onClick={onAccountCancel} className='app-cancel-btn footer-btn' text='Cancel' />
            {
                editMode
                    ? <CustomButton onClick={handleAccountUpdate} className={`app-create-btn footer-btn ${btnDisabled && 'disabled'} ${shake && 'app-shake'} `} text='Update' />
                    : (
                        <div className='multi-buttons-container'>
                            <CustomButton onClick={handleAccountEdit} className='footer-btn' text='Edit' />
                        </div>
                    )
            }
        </div>)
    }

    const handleAccountUpdate = async () => {
        const { idProofType } = accountValues
        const IDProofError = validateIDProofs(IDProofs, idProofType)
        const accountErrors = validateAccountValues(accountValues, customertype, true)

        if (!isEmpty(accountErrors) || !isEmpty(IDProofError)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setIDProofErrors(IDProofError)
            setAccountErrors(accountErrors)
            return
        }
        const idProofs = getIdProofsForDB(IDProofs, idProofType)
        const account = customertype === 'Corporate' ? extractCADetails(accountValues) : extractGADetails(accountValues)

        const url = '/customer/updateCustomer'
        const body = { ...account, idProofs }
        const options = { item: 'Customer', v1Ing: 'Updating', v2: 'updated' }

        const { Address1, organizationName } = account

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(url, body)
            setBtnDisabled(false)
            resetTrackForm()
            onUpdate(organizationName, Address1)
            showToast(options)
        } catch (error) {
            setBtnDisabled(false)
            message.destroy()
        }
    }

    const onAccountCancel = useCallback(() => handleBack(), [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleConfirmModalOk = useCallback(() => { setConfirmModal(false); goBack() }, [])

    const handleBack = () => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged) {
            setConfirmModal(true)
        }
        else goBack()
    }

    const goBack = () => {
        const mainPathname = getMainPathname(pathname)
        history.push(mainPathname)
    }

    return (
        <div className='account-view-account-overview app-manage-content'>
            <ScrollUp dep={editMode} />
            {
                loading ? <NoContent content={<Spinner />} />
                    : <>
                        {
                            editMode ? customertype === 'Corporate' ?
                                <CorporateAccountForm
                                    IDProofs={IDProofs}
                                    data={accountValues}
                                    errors={accountErrors}
                                    IDProofErrors={IDProofErrors}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    onUpload={handleProofUpload}
                                    onRemove={handleProofRemove}
                                    disabled={isApproved && !isSuperAdmin}
                                />
                                : <GeneralAccountForm
                                    IDProofs={IDProofs}
                                    data={accountValues}
                                    errors={accountErrors}
                                    IDProofErrors={IDProofErrors}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    onUpload={handleProofUpload}
                                    onRemove={handleProofRemove}
                                    disabled={isApproved && !isSuperAdmin}
                                    accountOnly
                                /> : <>
                                    <IDProofInfo data={IDProofs} />
                                    <IDProofInfo data={gstProofs} />
                                    <AccountView data={accountValues} />
                                </>
                        }
                        {
                            isApproved && !isSuperAdmin ? null : renderFooter()
                        }
                    </>
            }
            <ConfirmModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </div>
    )
}


export default AccountOverview