import axios from 'axios';
import { useParams } from 'react-router-dom';
import { message, Divider } from 'antd';
import React, { Fragment, useEffect, useState, useMemo } from 'react';
import BankView from '../../views/Bank';
import VendorForm from '../../forms/Vendor';
import AccountView from '../../views/Account';
import { http } from '../../../../modules/http'
import Spinner from '../../../../components/Spinner';
import useUser from '../../../../utils/hooks/useUser';
import ScrollUp from '../../../../components/ScrollUp';
import NoContent from '../../../../components/NoContent';
import CustomButton from '../../../../components/CustomButton';
import { isEmpty, showToast, resetTrackForm } from '../../../../utils/Functions';
import { ACCOUNTSADMIN, MARKETINGMANAGER, SUPERADMIN, WAREHOUSEADMIN } from '../../../../utils/constants';
import { validateNumber, validateIFSCCode, validateVendorValues, validateClosureAccValues, validateNames } from '../../../../utils/validations';
import '../../../../sass/employees.scss'

const ManageClosedCustomer = ({ setHeaderContent, onGoBack, onUpdate }) => {
    const { ROLE } = useUser()
    const { vendorId } = useParams()
    const [formData, setFormData] = useState({})
    const [accData, setAccData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [accErrors, setAccErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [editMode, setEditMode] = useState('')
    const [shake, setShake] = useState(false)

    const isWHAdmin = useMemo(() => ROLE === WAREHOUSEADMIN, [ROLE])
    const canEdit = useMemo(() => ROLE === SUPERADMIN || ROLE === MARKETINGMANAGER
        || ROLE === WAREHOUSEADMIN || ROLE === ACCOUNTSADMIN, [ROLE])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getVendor()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getVendor = async () => {
        const url = `vendors/getVendorById/${vendorId}`

        try {
            const [data] = await http.GET(axios, url, config)
            const { accountNumber, bankName, branchName, ifscCode, customerName, ...rest } = data
            const { vendorName, address } = rest

            setHeaderContent({ title: vendorName, address })
            setFormData(rest)
            setAccData({ accountNumber, bankName, branchName, ifscCode, customerName })
            setLoading(false)
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'contactPerson') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'creditPeriod') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
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

    const handleUpdate = async () => {
        const formErrors = validateVendorValues(formData)
        const accErrors = validateClosureAccValues(accData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            setAccErrors(accErrors)
            return
        }

        const body = { ...formData, ...accData }
        const url = 'vendors/updateVendor'
        const options = { item: 'Customer Closure', v1Ing: 'Updating', v2: 'updated' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            resetTrackForm()
            setEditMode(false)
            setBtnDisabled(false)
            onUpdate()
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const handleEdit = () => {
        setEditMode(true)
    }

    return (
        <Fragment>
            <ScrollUp dep={editMode} />
            <div className='app-manage-content employee-manage-content p-0'>
                {
                    loading
                        ? <NoContent content={<Spinner />} />
                        : <>
                            <div className='employee-title-container'>
                                <span className='title'>Vendor Details</span>
                            </div>
                            {
                                editMode ? (
                                    <>
                                        <VendorForm
                                            data={formData}
                                            accData={accData}
                                            errors={formErrors}
                                            accErrors={accErrors}
                                            onAccBlur={handleAccBlur}
                                            onChange={handleChange}
                                            onAccChange={handleAccChange}
                                            hideBank={isWHAdmin}
                                        />
                                    </>
                                ) :
                                    <>
                                        <AccountView data={formData} accData={accData} />
                                        {
                                            isWHAdmin ? null
                                                : <>
                                                    <Divider className='form-divider half-line' />
                                                    <div className='employee-title-container inner'>
                                                        <span className='title'>Bank Account Details</span>
                                                    </div>
                                                    <BankView data={accData} />
                                                </>
                                        }
                                    </>
                            }
                            {
                                canEdit &&
                                (
                                    <div className={`app-footer-buttons-container ${editMode ? 'edit' : 'view'}`}>
                                        <CustomButton onClick={onGoBack} className='app-cancel-btn footer-btn' text='Cancel' />
                                        {
                                            editMode
                                                ?
                                                <div className='multi-buttons-container' style={{ maxWidth: '70%' }}>
                                                    <CustomButton
                                                        onClick={handleUpdate}
                                                        className={`app-create-btn ${(btnDisabled || isWHAdmin && !formData.isConfirmed) && 'disabled'} ${shake && 'app-shake'} `}
                                                        text='Update'
                                                        style={{ marginLeft: '1em' }}
                                                    />
                                                </div>
                                                : (
                                                    <div className='multi-buttons-container'>
                                                        <CustomButton onClick={handleEdit} className='footer-btn' text='Edit' />
                                                    </div>
                                                )
                                        }
                                    </div>
                                )
                            }
                        </>
                }
            </div>
        </Fragment>
    )
}

export default ManageClosedCustomer
