import axios from 'axios';
import { message } from 'antd';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { http } from '../../../modules/http';
import PlantForm from '../forms/Plant';
import { getStaffOptions } from '../../../assets/fixtures';
import CustomButton from '../../../components/CustomButton';
import { validateMobileNumber, validateNames, validatePlantValues, validatePinCode } from '../../../utils/validations';
import { getBase64, getMainPathname, getPlantValuesForDB, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';

const CreateNewPlant = ({ goToTab }) => {
    const { pathname } = useLocation()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [staffList, setStaffList] = useState([])
    const [shake, setShake] = useState(false)
    const [admin, setAdmin] = useState({})
    const [plantType, setPlantType] = useState('')

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const staffOptions = useMemo(() => getStaffOptions(staffList), [staffList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getPlantType()
        getStaffList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getStaffList = async () => {
        const roleName = getRoleName()
        const url = `/users/getUsersByRole/${roleName}`

        try {
            const data = await http.GET(axios, url, config)
            setStaffList(data)
        } catch (error) { }
    }

    const getPlantType = () => {
        const type = mainUrl === '/warehouses' ? 'Warehouse' : 'MotherPlant'
        setPlantType(type)
    }

    const getRoleName = () => {
        return mainUrl === '/warehouses' ? 'WarehouseAdmin' : 'MotherPlantAdmin'
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'adminId') {
            const admin = staffList.find(staff => staff.userId === value)
            setAdmin(admin)
        }

        // Validations
        if (key === 'departmentName' || key === 'city' || key === 'state') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'pinCode') {
            const error = validatePinCode(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations

        if (key === 'pinCode') {
            const error = validatePinCode(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleUpload = (file) => {
        getBase64(file, async (buffer) => {
            setFormData(data => ({ ...data, gstProof: buffer }))
            setFormErrors(errors => ({ ...errors, gstProof: '' }))
        })
    }

    const handleRemove = () => setFormData(data => ({ ...data, gstProof: '' }))

    const handleSubmit = async () => {
        const formErrors = validatePlantValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const motherplant = getPlantValuesForDB(formData)
        let body = {
            ...motherplant
        }
        const url = `${mainUrl.slice(0, -1)}/create${plantType}`
        const options = { item: plantType, v1Ing: 'Adding', v2: 'added' }


        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            goToTab('1')
            resetForm()
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
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
            <div className='plant-title-container'>
                <span className='title'>New {plantType} Details</span>
            </div>
            <PlantForm
                data={formData}
                admin={admin}
                errors={formErrors}
                onBlur={handleBlur}
                onChange={handleChange}
                onUpload={handleUpload}
                onRemove={handleRemove}
                staffOptions={staffOptions}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    disabled={btnDisabled}
                    className={`
                    app-create-btn footer-btn
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Add'
                />
            </div>
        </>
    )
}

export default CreateNewPlant