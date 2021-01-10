import { message } from 'antd';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { http } from '../../../modules/http';
import CreateEmployeeForm from '../forms/CreateEmployee';
import { getRoleOptions } from '../../../assets/fixtures';
import CustomButton from '../../../components/CustomButton';
import { getMainPathname, getPlantValuesForDB, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { validateIDNumbers, validateMobileNumber, validateNames, validateEmployeeValues } from '../../../utils/validations';
import dayjs from 'dayjs';

const CreateEmployee = ({ goToTab }) => {
    const { pathname } = useLocation()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
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
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const getEmployeeType = (url) => {
        const type = url === '/staff' ? 'Staff' : 'Driver'
        setEmployeeType(type)
    }

    const handleSubmit = async () => {
        const formErrors = validateEmployeeValues(formData, employeeType)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let body = {
            ...formData
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
        setAdmin({})
        setFormErrors({})
    }

    return (
        <>
            <CreateEmployeeForm
                title={employeeType}
                data={formData}
                admin={admin}
                errors={formErrors}
                onBlur={handleBlur}
                onChange={handleChange}
                roleOptions={roleOptions}
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