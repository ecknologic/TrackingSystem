import React, { useState, useCallback, useEffect, useMemo } from 'react';
import CustomButton from '../../../components/CustomButton';
import FormHeader from '../../../components/FormHeader';
import DispatchForm from '../forms/DispatchForm';
import ConfirmModal from '../../../components/CustomModal';
import { removeFormTracker, resetTrackForm, showToast, trackAccountFormOnce } from '../../../utils/Functions';
import { getBatchIdOptions, getDepartmentOptions, getDriverOptions, getVehiclesOptions } from '../../../assets/fixtures';

import { getWarehoseId, TRACKFORM } from '../../../utils/constants';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { validateMobileNumber, validateNames, validateNumber, validateVehicleNo } from '../../../utils/validations';
import { http } from '../../../modules/http';
import { message } from 'antd';

const CreateDispatch = ({ setActiveTab }) => {
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)
    const [batches, setBatches] = useState([])
    const [driversList, setDrivers] = useState([])
    const [departments, setDepartmentsList] = useState([])
    const [vehiclesList, setVehiclesList] = useState([])
    const batchIdOptions = useMemo(() => getBatchIdOptions(batches), [batches])
    const driversListOptions = useMemo(() => getDriverOptions(driversList), [driversList])
    const departmentListOptions = useMemo(() => getDepartmentOptions(departments), [departments])
    const vehiclesListOptions = useMemo(() => getVehiclesOptions(vehiclesList), [vehiclesList])

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()
        getBatchsList()
        getDepartmentsList()
        getDriversList()
        getVehicleDetails()

        return () => {
            removeFormTracker()
        }
    }, [])
    const getBatchsList = async () => {
        const data = await http.GET('/motherplant/getBatchNumbers')
        setBatches(data)
    }
    const getDriversList = async () => {
        const data = await http.GET('/warehouse/getdriverDetails/' + getWarehoseId())
        setDrivers(data)
    }
    const getDepartmentsList = async () => {
        const data = await http.GET('/motherplant/getDepartmentsList?departmentType=warehouse')
        setDepartmentsList(data)
    }
    const getVehicleDetails = async () => {
        const data = await http.GET('/motherplant/getVehicleDetails')
        setVehiclesList(data)
    }
    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'driverId') {
            let selectedDriver = driversList.filter(driver => driver.driverId == value)
            let { driverName = null, mobileNumber = null } = selectedDriver.length ? selectedDriver[0] : []
            setFormData(data => ({ ...data, driverName, mobileNumber }))
        }
        if (key === 'managerName') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('product')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, products: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleDispatchCreate = async () => {
        let body = { ...formData }
        const url = '/motherplant/addDispatchDetails'
        try {
            setBtnDisabled(true)
            showToast('Dispatch', 'loading')
            await http.POST(url, body)
            message.destroy()
            setActiveTab('1')
        } catch (error) {
            message.destroy()
            setBtnDisabled(false)
        }
    }
    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        setBtnDisabled(false)
        setFormData({})
        setFormErrors({})
    }

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    return (
        <>
            <FormHeader title='Create Dispatch DC' />
            <DispatchForm
                track
                data={formData}
                errors={formErrors}
                onChange={handleChange}
                onBlur={handleBlur}
                batchIdOptions={batchIdOptions}
                driverOptions={driversListOptions}
                departmentOptions={departmentListOptions}
                vehicleOptions={vehiclesListOptions}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleDispatchCreate}
                    className={`
                    app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Create'
                />
            </div>
            <ConfirmModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </>
    )
}

export default CreateDispatch