import dayjs from 'dayjs';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { http } from '../../../../modules/http';
import { base64String, getBase64, getIdProofsForDB } from '../../../../utils/Functions';
import CustomButton from '../../../../components/CustomButton';
import CorporateAccountForm from '../../add/forms/CorporateAccount';
import NoContent from '../../../../components/NoContent';
import Spinner from '../../../../components/Spinner';
import { validateIDProofs, validateAccountValues } from '../../../../utils/validations';
import GeneralAccountForm from '../../add/forms/GeneralAccount';

const AccountOverview = ({ data }) => {
    const { gstProof, idProof_backside, idProof_frontside, isActive, registeredDate,
        customertype, Address1, loading } = data

    const [btnDisabled, setBtnDisabled] = useState(false)
    const [accountValues, setAccountValues] = useState({})
    const [IDProofs, setIDProofs] = useState({})

    useEffect(() => {
        if (!loading) {
            const gst = base64String(gstProof?.data)
            const Front = base64String(idProof_frontside?.data)
            const Back = base64String(idProof_backside?.data)

            const newData = {
                ...data, gstProof: gst, address: Address1,
                registeredDate: dayjs(registeredDate).format('YYYY-MM-DD')
            }
            setIDProofs({ Front, Back })
            setAccountValues(newData)
        }
    }, [loading])

    const handleChange = (value, key) => {
        setAccountValues(data => ({ ...data, [key]: value }))
    }

    const handleProofUpload = (file, name) => {
        getBase64(file, async (buffer) => {
            if (name === 'gstProof') {
                setAccountValues(data => ({ ...data, [name]: buffer }))
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
        if (name === 'gstProof') setAccountValues(data => ({ ...data, [name]: '' }))
        else if (name === 'Front') setIDProofs(data => ({ ...data, Front: '' }))
        else if (name === 'Back') setIDProofs(data => ({ ...data, Back: '' }))
    }

    const renderFooter = () => {
        return (<div className='app-footer-buttons-container footer'>
            {/* <CustomButton
                className='app-cancel-btn footer-btn'
                text='Cancel'
            /> */}
            <CustomButton
                onClick={handleAccountUpdate}
                className={`app-create-btn footer-btn ${btnDisabled && 'disabled'}`}
                text='Update Account'
            />
        </div>)
    }

    const handleAccountUpdate = async () => {
        const IDProofError = validateIDProofs(IDProofs)
        if (Object.keys(IDProofError).length) {
            message.error('Validation error')// update errors object
            console.log(IDProofError)
            return
        }

        const accountErrors = validateAccountValues(accountValues, customertype)
        if (Object.keys(accountErrors).length) {
            message.error('Validation error')// update errors object
            console.log(accountErrors)
            return
        }

        const Address1 = accountValues.address
        const idProofs = getIdProofsForDB(IDProofs)

        const body = { ...accountValues, Address1, idProofs }
        const url = '/customer/updateCustomer'

        try {
            setBtnDisabled(true)
            message.loading('Updating customer...', 0)
            await http.POST(url, body)
            setBtnDisabled(false)
            message.success('Customer updated successfully!')
        } catch (error) {
            setBtnDisabled(false)
            message.destroy()
        }
    }

    return (

        <div className='account-view-account-overview'>
            {
                loading ? <NoContent content={<Spinner />} />
                    : <>
                        {
                            customertype === 'Corporate' ?
                                <CorporateAccountForm
                                    data={accountValues}
                                    IDProofs={IDProofs}
                                    onUpload={handleProofUpload}
                                    onRemove={handleProofRemove}
                                    onChange={handleChange}
                                    disabled={isActive}
                                />
                                : <GeneralAccountForm
                                    data={accountValues}
                                    IDProofs={IDProofs}
                                    onUpload={handleProofUpload}
                                    onRemove={handleProofRemove}
                                    onChange={handleChange}
                                    disabled={isActive}
                                    accountOnly
                                />
                        }
                        {
                            !isActive && renderFooter()
                        }
                    </>
            }

        </div>
    )
}


export default AccountOverview