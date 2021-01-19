import { message } from 'antd';
import React, { useMemo, useState } from 'react';
import RouteForm from '../forms/Route';
import { http } from '../../../modules/http';
import { getRole, getWarehoseId } from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';
import { isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';

const CreateRoute = ({ goToTab, departmentOptions }) => {
    const role = getRole()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [shake, setShake] = useState(false)

    const isWHAdmin = useMemo(() => role === 'WarehouseAdmin', [role])

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))
    }

    const handleSubmit = async () => {
        const formErrors = {}
        let { RouteName, RouteDescription, departmentId } = formData
        if (!isWHAdmin && !departmentId) formErrors.departmentId = 'Required'
        if (!RouteName) formErrors.RouteName = 'Required'
        if (!RouteDescription) formErrors.RouteDescription = 'Required'

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        departmentId = isWHAdmin ? getWarehoseId() : departmentId
        let body = { ...formData, departmentId }
        const url = '/warehouse/createRoute'
        const options = { item: 'Route', v1Ing: 'Adding', v2: 'added' }

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
        setFormErrors({})
    }

    return (
        <>
            <div className='employee-title-container'>
                <span className='title'>New Route Details</span>
            </div>
            <RouteForm
                data={formData}
                errors={formErrors}
                isWHAdmin={isWHAdmin}
                onChange={handleChange}
                departmentOptions={departmentOptions}
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

export default CreateRoute