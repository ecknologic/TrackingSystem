import { Radio } from 'antd';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import CustomButton from '../../../components/CustomButton';
import FormHeader from '../../../components/FormHeader';
import ExternalDispatchForm from '../forms/ExternalDispatchForm';
import ConfirmModal from '../../../components/CustomModal';
import { resetTrackForm } from '../../../utils/Functions';
import { getWarehoseId,TRACKFORM } from '../../../utils/constants';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { validateMobileNumber, validateNames, validateNumber } from '../../../utils/validations';
import InputLabel from '../../../components/InputLabel';
import { getBatchIdOptions, getDepartmentOptions, getDriverOptions, getVehiclesOptions } from '../../../assets/fixtures';
import { http } from '../../../modules/http';
 
const CreateExternalDispatch = () => {
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

    useEffect(()=>{
        getBatchsList()
        getDepartmentsList()
        getDriversList()
        getVehicleDetails()
    },[])
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
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'contactPerson') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('price') || key.includes('product')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBatchCreate = () => {

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
            <ExternalDispatchForm
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
            {/* <div className='input-container'>
                <InputLabel name='Select Payment Mode' mandatory />
                <Radio.Group size='large' options={plainOptions} onChange={() => { }} />
            </div> */}
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleBatchCreate}
                    className={`
                    app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Create DC'
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
const plainOptions = ['Add Debit/Credit/ATM Card', 'Add Net Banking', 'Pay on Delivery (Cash/UPI/Card)'];
export default CreateExternalDispatch