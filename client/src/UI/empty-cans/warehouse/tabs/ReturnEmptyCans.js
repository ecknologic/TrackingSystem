import axios from 'axios';
import { message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import EmptyCansForm from '../forms/EmptyCans';
import { http } from '../../../../modules/http';
import { getWarehoseId } from '../../../../utils/constants';
import CustomButton from '../../../../components/CustomButton';
import { isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
import { validateNumber, validateRECValues } from '../../../../utils/validations';

const ReturnEmptyCans = ({ goToTab, fetchList, driverList, ...rest }) => {
    const warehouseId = getWarehoseId()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [shake, setShake] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        fetchList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'driverId') {
            let selectedDriver = driverList.find(driver => driver.driverId === Number(value))
            let { mobileNumber = null } = selectedDriver || {}
            setFormData(data => ({ ...data, mobileNumber }))
            setFormErrors(errors => ({ ...errors, mobileNumber: '' }))
        }
        else if (key === 'isDamaged') {
            if (!value) {
                let damaged20LCans, damaged2LBoxes, damaged1LBoxes, damaged500MLBoxes, damaged300MLBoxes, damagedDesc;
                setFormData(data => ({
                    ...data, damaged20LCans, damaged2LBoxes, damaged1LBoxes, damaged500MLBoxes, damaged300MLBoxes, damagedDesc
                }))
                setFormErrors(errors => ({ ...errors, damagedDesc: '', damaged: '' }))
            }
        }

        // Validations
        if (key.includes('Box') || key.includes('Can')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, damaged: error }))
        }
        else if (key === 'emptycans_count') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, emptycans_count: error }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateRECValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let url = '/warehouse/returnEmptyCans'
        const body = {
            ...formData, warehouseId
        }
        const options = { item: 'Empty Cans', v1Ing: 'Returning', v2: 'returned' }

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
        setFormErrors({})
    }

    return (
        <div className='employee-manager-content'>
            <div className='employee-title-container'>
                <span className='title'>New Empty Cans Details</span>
            </div>
            <EmptyCansForm
                data={formData}
                errors={formErrors}
                onChange={handleChange}
                {...rest}
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

export default ReturnEmptyCans