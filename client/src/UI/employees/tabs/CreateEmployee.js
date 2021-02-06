import axios from 'axios';
import { message } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { http } from '../../../modules/http';
import EmployeeForm from '../forms/Employee';
import DependentForm from '../forms/Dependent';
import CustomButton from '../../../components/CustomButton';
import { getDepartmentOptions, getRoleOptions } from '../../../assets/fixtures';
import { getBase64, getMainPathname, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import {
    validateIDNumbers, validateMobileNumber, validateNames, validateEmployeeValues, validateEmailId,
    validateIFSCCode, validateIDProofs, validateNumber, validateDependentValues
} from '../../../utils/validations';

const CreateEmployee = ({ goToTab }) => {
    const { pathname } = useLocation()
    const history = useHistory()
    const [formData, setFormData] = useState({})
    const [depValues, setDepValues] = useState({})
    const [depErrors, setDepErrors] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [adharProof, setAdharProof] = useState({})
    const [licenseProof, setLicenseProof] = useState({})
    const [adharProofErrors, setAdharProofErrors] = useState({})
    const [depAdharProof, setDepAdharProof] = useState({})
    const [depAdharProofErrors, setDepAdharProofErrors] = useState({})
    const [licenseProofErrors, setLicenseProofErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [roleList, setRoleList] = useState([])
    const [departmentList, setDepartmentList] = useState([])
    const [shake, setShake] = useState(false)
    const [employeeType, setEmployeeType] = useState('Staff')

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const roleOptions = useMemo(() => getRoleOptions(roleList), [roleList])
    const departmentOptions = useMemo(() => getDepartmentOptions(departmentList), [departmentList])
    const childProps = useMemo(() => ({ roleOptions, departmentOptions }),
        [roleOptions, departmentOptions])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getEmployeeType(mainUrl)
        getDepartmentList()
        getRoleList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getRoleList = async () => {
        const url = '/roles/getRoles'

        try {
            const data = await http.GET(axios, url, config)
            setRoleList(data)
        } catch (error) { }
    }

    const getDepartmentList = async () => {
        const url = '/bibo/getAllDepartmentsList?hasNone=true&availableOnly=true'

        try {
            const data = await http.GET(axios, url, config)
            setDepartmentList(data)
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'roleId') {
            if (value === 6) setEmployeeType('Driver')
            else {
                setFormData(data => ({ ...data, departmentId: null }))
                setEmployeeType('Staff')
            }
        }

        // Validations
        if (key === 'adharNo' || key === 'licenseNo') {
            const error = validateIDNumbers(key, value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'userName' || key === 'parentName' || key === 'branchName'
            || key === 'recruitedBy' || key === 'recommendedBy' || key === 'bankName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'accountNo') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'ifscCode') {
            const error = validateIFSCCode(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleDepChange = (value, key) => {
        setDepValues(data => ({ ...data, [key]: value }))
        setDepErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'adharNo') {
            const error = validateIDNumbers(key, value)
            setDepErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'name' || key === 'relation') {
            const error = validateNames(value)
            setDepErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value)
            setDepErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {

        // Validations
        if (key === 'adharNo' || key === 'licenseNo') {
            const error = validateIDNumbers(key, value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'ifscCode') {
            const error = validateIFSCCode(value, true)
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

    const handleDepBlur = (value, key) => {

        // Validations
        if (key === 'adharNo') {
            const error = validateIDNumbers(key, value, true)
            setDepErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value, true)
            setDepErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleUpload = (file, name, proofType) => {
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
                else {
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
                else {
                    setLicenseProofErrors(errors => ({ ...errors, [name]: '' }))
                    const clone = { ...licenseProof }
                    clone[name] = buffer
                    setLicenseProof(clone)
                }
            }
        })
    }
    const handleDepUpload = (file, name) => {
        getBase64(file, async (buffer) => {
            if (name === 'any') {
                const clone = { ...depAdharProof }
                const { Front } = clone
                if (Front) {
                    clone.Back = buffer
                    setDepAdharProofErrors(errors => ({ ...errors, Back: '' }))
                }
                else {
                    clone.Front = buffer
                    setDepAdharProofErrors(errors => ({ ...errors, Front: '' }))
                }
                setDepAdharProof(clone)
            }
            else {
                setDepAdharProofErrors(errors => ({ ...errors, [name]: '' }))
                const clone = { ...depAdharProof }
                clone[name] = buffer
                setDepAdharProof(clone)
            }
        })
    }

    const handleRemove = (name, proofType) => {
        if (proofType === 'adharProof') {
            if (name === 'Front') setAdharProof(data => ({ ...data, Front: '' }))
            else if (name === 'Back') setAdharProof(data => ({ ...data, Back: '' }))
        }
        else if (proofType === 'licenseProof') {
            if (name === 'Front') setLicenseProof(data => ({ ...data, Front: '' }))
            else if (name === 'Back') setLicenseProof(data => ({ ...data, Back: '' }))
        }
    }

    const handleDepRemove = (name) => {
        if (name === 'Front') setDepAdharProof(data => ({ ...data, Front: '' }))
        else if (name === 'Back') setDepAdharProof(data => ({ ...data, Back: '' }))
    }

    const getEmployeeType = (url) => {
        const type = url === '/staff' ? 'Staff' : 'Driver'
        setEmployeeType(type)
    }

    const handleSubmit = async () => {
        const adharProofErrors = validateIDProofs(adharProof)
        const depAdharProofErrors = validateIDProofs(depAdharProof)
        const licenseProofErrors = employeeType === 'Driver' ? validateIDProofs(licenseProof) : {}
        const formErrors = validateEmployeeValues(formData, employeeType)
        const depErrors = validateDependentValues(depValues)

        if (!isEmpty(formErrors) || !isEmpty(adharProofErrors) || !isEmpty(licenseProofErrors)
            || !isEmpty(depErrors) || !isEmpty(depAdharProofErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            setDepErrors(depErrors)
            setAdharProofErrors(adharProofErrors)
            setLicenseProofErrors(licenseProofErrors)
            setDepAdharProofErrors(depAdharProofErrors)
            return
        }

        const dependentDetails = { ...depValues, adharProof: depAdharProof }
        let body = {
            ...formData, adharProof, licenseProof, dependentDetails
        }
        const url = getUrl(employeeType)
        const options = { item: employeeType, v1Ing: 'Adding', v2: 'added' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            postCreation(employeeType)
            resetForm()
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const postCreation = (type) => {
        if (type === 'Staff') goToTab('1')
        else history.push('/drivers')
    }

    const resetForm = () => {
        setBtnDisabled(false)
        resetTrackForm()
        setFormData({})
        setAdharProof({})
        setLicenseProof({})
        setFormErrors({})
    }

    return (
        <>
            <div className='employee-title-container'>
                <span className='title'>New {employeeType} Details</span>
            </div>
            <EmployeeForm
                data={formData}
                errors={formErrors}
                adharProof={adharProof}
                licenseProof={licenseProof}
                adharProofErrors={adharProofErrors}
                licenseProofErrors={licenseProofErrors}
                onBlur={handleBlur}
                onChange={handleChange}
                onUpload={handleUpload}
                onRemove={handleRemove}
                editMode={false}
                {...childProps}
            />
            <DependentForm
                data={depValues}
                errors={depErrors}
                adharProof={depAdharProof}
                adharProofErrors={depAdharProofErrors}
                onBlur={handleDepBlur}
                onChange={handleDepChange}
                onUpload={handleDepUpload}
                onRemove={handleDepRemove}
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

const getUrl = (type) => {
    const staffUrl = '/users/createWebUser'
    const driverUrl = '/driver/createDriver'

    if (type === 'Staff') return staffUrl
    return driverUrl
}

export default CreateEmployee