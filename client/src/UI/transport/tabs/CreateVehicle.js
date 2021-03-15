import axios from 'axios';
import { message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import VehicleForm from '../forms/Vehicle';
import { http } from '../../../modules/http';
import { validateNames } from '../../../utils/validations';
import CustomButton from '../../../components/CustomButton';
import { isAlphaNum, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';

const CreateVehicle = ({ goToTab }) => {
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [shake, setShake] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'vehicleName' || key === 'vehicleType') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'vehicleNo') {
            const isValid = isAlphaNum(value)
            if (!isValid) setFormErrors(errors => ({ ...errors, [key]: 'Enter aphanumeric only' }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = {}
        const { vehicleName, vehicleType, vehicleNo } = formData
        if (!vehicleType) formErrors.vehicleType = 'Required'
        else {
            const error = validateNames(vehicleType)
            if (error) formErrors.vehicleType = error
        }
        if (!vehicleName) formErrors.vehicleName = 'Required'
        else {
            const error = validateNames(vehicleName)
            if (error) formErrors.vehicleName = error
        }
        if (!vehicleNo) formErrors.vehicleNo = 'Required'
        else {
            const isValid = isAlphaNum(vehicleNo)
            if (!isValid) formErrors.vehicleNo = 'Enter aphanumeric only'
        }

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let body = { ...formData }
        const url = '/motherPlant/createVehicle'
        const options = { item: 'Vehicle', v1Ing: 'Adding', v2: 'added' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            goToTab('2')
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
        setFormErrors({})
    }

    return (
        <div className='employee-manager-content'>
            <div className='employee-title-container'>
                <span className='title'>New Vehicle Details</span>
            </div>
            <VehicleForm
                data={formData}
                errors={formErrors}
                onChange={handleChange}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    className={`
                    app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Add'
                />
            </div>
        </div>
    )
}

export default CreateVehicle