import axios from 'axios';
import { message } from 'antd';
import { useLocation, useParams } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import PlantForm from '../../forms/Plant';
import AccountView from '../../views/Account';
import { http } from '../../../../modules/http'
import Spinner from '../../../../components/Spinner';
import ScrollUp from '../../../../components/ScrollUp';
import NoContent from '../../../../components/NoContent';
import IDProofInfo from '../../../../components/IDProofInfo';
import { getStaffOptions } from '../../../../assets/fixtures';
import CustomButton from '../../../../components/CustomButton';
import { isEmpty, showToast, base64String, getMainPathname, getBase64, getPlantValuesForDB, resetTrackForm } from '../../../../utils/Functions';
import { validateNames, validateMobileNumber, validatePinCode, validatePlantValues } from '../../../../utils/validations';
import '../../../../sass/plants.scss'

const ManagePlant = ({ setHeaderContent, onGoBack }) => {
    const { plantId } = useParams()
    const { pathname } = useLocation()
    const [accountValues, setAccountValues] = useState({ loading: true })
    const [loading, setLoading] = useState(true)
    const [gstProof, setGstProof] = useState({})
    const [accountErrors, setAccountErrors] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [shake, setShake] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [plantType, setPlantType] = useState('')
    const [staffList, setStaffList] = useState([])
    const [admin, setAdmin] = useState({})
    const [prevAdminId, setPrevAdminId] = useState('')

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const staffOptions = useMemo(() => getStaffOptions(staffList), [staffList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getPlantType()
        getPlant()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getPlant = async () => {
        const url = `${getUrl(mainUrl)}/${plantId}`

        try {
            const [data] = await http.GET(axios, url, config)
            const { gstProof: gst, userName, mobileNumber, emailid, roleId, ...rest } = data
            const { departmentName, gstNo, adminId } = rest
            const gstProof = base64String(gst?.data)

            setGstProof({ Front: gstProof, idProofType: 'gstNo', gstNo })
            setHeaderContent({ title: departmentName })
            setAccountValues({ ...rest, gstProof })
            setPrevAdminId(adminId)
            setAdmin({ userName, mobileNumber, emailid, roleId })
            setLoading(false)
        } catch (error) { }
    }

    const getPlantType = () => {
        const type = mainUrl === '/warehouses' ? 'Warehouse' : 'MotherPlant'
        setPlantType(type)
        return type
    }

    const getStaffList = async (type) => {
        const url = `users/getUsersBydepartmentType/${type}`

        try {
            const data = await http.GET(axios, url, config)
            setStaffList(data)
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setAccountValues(data => ({ ...data, [key]: value }))
        setAccountErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'adminId') {
            const admin = staffList.find(staff => staff.userId === value)
            setAdmin(admin)
        }

        // Validations
        if (key === 'departmentName' || key === 'city' || key === 'state') {
            const error = validateNames(value)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'pinCode') {
            const error = validatePinCode(value)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations

        if (key === 'pinCode') {
            const error = validatePinCode(value, true)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleUpload = (file) => {
        getBase64(file, async (buffer) => {
            setAccountValues(data => ({ ...data, gstProof: buffer }))
            setAccountErrors(errors => ({ ...errors, gstProof: '' }))
        })
    }

    const handleRemove = () => setAccountValues(data => ({ ...data, gstProof: '' }))

    const handleUpdate = async () => {
        const formErrors = validatePlantValues(accountValues)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setAccountErrors(formErrors)
            return
        }

        const motherplant = getPlantValuesForDB(accountValues)
        let removedAdminId;

        if (motherplant.adminId !== prevAdminId) {
            removedAdminId = prevAdminId
        }

        const url = updateUrl(mainUrl)
        let body = { ...motherplant, removedAdminId }
        const options = { item: plantType, v1Ing: 'Updating', v2: 'updated' }


        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            resetTrackForm()
            setEditMode(false)
            setBtnDisabled(false)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const handleEdit = () => {
        getStaffList(plantType)
        setEditMode(true)
    }

    return (
        <Fragment>
            <ScrollUp dep={editMode} />
            <div className='app-manage-content plant-manage-content app-no-padding'>
                {
                    loading
                        ? <NoContent content={<Spinner />} />
                        : <>
                            <div className='plant-title-container'>
                                <span className='title'>{plantType} Details</span>
                            </div>
                            {
                                editMode
                                    ? (
                                        <PlantForm
                                            admin={admin}
                                            title={plantType}
                                            data={accountValues}
                                            errors={accountErrors}
                                            staffOptions={staffOptions}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            onUpload={handleUpload}
                                            onRemove={handleRemove}
                                        />
                                    )
                                    : <>
                                        <IDProofInfo data={gstProof} />
                                        <AccountView
                                            admin={admin}
                                            data={accountValues}
                                        />
                                    </>
                            }
                            <div className={`app-footer-buttons-container ${editMode ? 'edit' : 'view'}`}>
                                <CustomButton onClick={onGoBack} className='app-cancel-btn footer-btn' text='Cancel' />
                                {
                                    editMode
                                        ? <CustomButton onClick={handleUpdate} className={`app-create-btn footer-btn ${btnDisabled && 'disabled'} ${shake && 'app-shake'}`} text='Update' />
                                        : (
                                            <div className='multi-buttons-container'>
                                                <CustomButton onClick={handleEdit} className='footer-btn' text='Edit' />
                                            </div>
                                        )
                                }
                            </div>
                        </>
                }
            </div>
        </Fragment>
    )
}

const getUrl = (url) => {
    const mpUrl = 'motherPlant/getMotherPlantById'
    const whUrl = 'warehouse/getWarehouseById'

    if (url === '/motherplants') return mpUrl
    return whUrl
}

const updateUrl = (url) => {
    const mpUrl = 'motherPlant/updateMotherPlant'
    const whUrl = 'warehouse/updateWarehouse'

    if (url === '/motherplants') return mpUrl
    return whUrl
}

export default ManagePlant
