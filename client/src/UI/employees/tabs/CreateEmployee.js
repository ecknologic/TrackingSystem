import { message } from 'antd';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { http } from '../../../modules/http';
import CreateEmployeeForm from '../forms/CreateEmployee';
import { getRoleOptions } from '../../../assets/fixtures';
import CustomButton from '../../../components/CustomButton';
import { getBase64, getMainPathname, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { validateIDNumbers, validateMobileNumber, validateNames, validateEmployeeValues, validateEmailId, validateIDProofs } from '../../../utils/validations';

const CreateEmployee = ({ goToTab }) => {
    const { pathname } = useLocation()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [adharProof, setAdharProof] = useState({})
    const [licenseProof, setLicenseProof] = useState({})
    const [adharProofErrors, setAdharProofErrors] = useState({})
    const [licenseProofErrors, setLicenseProofErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [roleList, setRoleList] = useState([])
    const [shake, setShake] = useState(false)
    const [admin, setAdmin] = useState({})
    const [employeeType, setEmployeeType] = useState('')

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const roleOptions = useMemo(() => getRoleOptions(roleList), [roleList])

    useEffect(() => {
        getEmployeeType(mainUrl)
        getRoles()
    }, [])

    const getRoles = async () => {
        const url = '/roles/getRoles'

        const data = await http.GET(url)
        setRoleList(data)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'adharNo' || key === 'licenseNo') {
            const error = validateIDNumbers(key, value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'userName' || key === 'parentName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {

        // Validations
        if (key === 'adharNo' || key === 'licenseNo') {
            const error = validateIDNumbers(key, value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'emailid') {
            const error = validateEmailId(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleProofUpload = (file, name, proofType) => {
        getBase64(file, async (buffer) => {
            if (proofType === 'adharProof') {
                if (name === 'any') {
                    const clone = { ...adharProof }
                    const { Front } = clone
                    if (Front) {
                        clone.Back = buffer
                        setAdharProofErrors(errors => ({ ...errors, Back: '' }))
                    }
                    else {
                        clone.Front = buffer
                        setAdharProofErrors(errors => ({ ...errors, Front: '' }))
                    }
                    setAdharProof(clone)
                }
                else if (name === 'Front' || name === 'Back') {
                    setAdharProofErrors(errors => ({ ...errors, [name]: '' }))
                    const clone = { ...adharProof }
                    clone[name] = buffer
                    setAdharProof(clone)
                }
            }
            else if (proofType === 'licenseProof') {
                if (name === 'any') {
                    const clone = { ...licenseProof }
                    const { Front } = clone
                    if (Front) {
                        clone.Back = buffer
                        setLicenseProofErrors(errors => ({ ...errors, Back: '' }))
                    }
                    else {
                        clone.Front = buffer
                        setLicenseProofErrors(errors => ({ ...errors, Front: '' }))
                    }
                    setLicenseProof(clone)
                }
                else if (name === 'Front' || name === 'Back') {
                    setLicenseProofErrors(errors => ({ ...errors, [name]: '' }))
                    const clone = { ...adharProof }
                    clone[name] = buffer
                    setLicenseProof(clone)
                }
            }
        })
    }

    const handleProofRemove = (name, proofType) => {
        if (proofType === 'adharProof') {
            if (name === 'Front') setAdharProof(data => ({ ...data, Front: '' }))
            else if (name === 'Back') setAdharProof(data => ({ ...data, Back: '' }))
        }
        else if (proofType === 'licenseProof') {
            if (name === 'Front') setLicenseProof(data => ({ ...data, Front: '' }))
            else if (name === 'Back') setLicenseProof(data => ({ ...data, Back: '' }))
        }

    }

    const getEmployeeType = (url) => {
        const type = url === '/staff' ? 'Staff' : 'Driver'
        setEmployeeType(type)
    }

    const handleSubmit = async () => {
        const adharProofErrors = validateIDProofs(adharProof)
        const licenseProofErrors = employeeType === 'Driver' ? validateIDProofs(licenseProof) : {}
        const formErrors = validateEmployeeValues(formData, employeeType)

        if (!isEmpty(formErrors) || !isEmpty(adharProofErrors) || !isEmpty(licenseProofErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            setAdharProofErrors(adharProofErrors)
            setLicenseProofErrors(licenseProofErrors)
            return
        }

        let body = {
            ...formData, adharProof, licenseProof
        }
        const url = getUrl(mainUrl)
        const options = { item: employeeType, v1Ing: 'Adding', v2: 'added' }


        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(url, body)
            showToast(options)
            goToTab('1')
            resetForm()
        } catch (error) {
            message.destroy()
            setBtnDisabled(false)
        }
    }

    const resetForm = () => {
        setBtnDisabled(false)
        resetTrackForm()
        setFormData({})
        setAdharProof({})
        setLicenseProof({})
        setFormErrors({})
        setAdmin({})
    }

    return (
        <>
            <CreateEmployeeForm
                admin={admin}
                data={formData}
                errors={formErrors}
                title={employeeType}
                adharProof={adharProof}
                roleOptions={roleOptions}
                licenseProof={licenseProof}
                adharProofErrors={adharProofErrors}
                licenseProofErrors={licenseProofErrors}
                onBlur={handleBlur}
                onChange={handleChange}
                onUpload={handleProofUpload}
                onRemove={handleProofRemove}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    className={`
                    app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Create'
                />
            </div>
        </>
    )
}

const getUrl = (url) => {
    const staffUrl = '/users/createWebUser'
    const driverUrl = '/driver/createDriver'

    if (url === '/staff') return staffUrl
    return driverUrl
}

export default CreateEmployee