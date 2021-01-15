import { message } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo, useState, useCallback } from 'react';
import Header from './header';
import AccountView from '../views/Account';
import { http } from '../../../modules/http'
import EmployeeForm from '../forms/Employee';
import Spinner from '../../../components/Spinner';
import ScrollUp from '../../../components/ScrollUp';
import NoContent from '../../../components/NoContent';
import QuitModal from '../../../components/CustomModal';
import IDProofInfo from '../../../components/IDProofInfo';
import CustomButton from '../../../components/CustomButton';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { getDepartmentOptions, getRoleOptions } from '../../../assets/fixtures';
import { isEmpty, showToast, base64String, getMainPathname, getBase64, getValidDate } from '../../../utils/Functions';
import { TRACKFORM } from '../../../utils/constants';
import {
    validateIDNumbers, validateNames, validateMobileNumber, validateEmailId, validateIDProofs,
    validateEmployeeValues
} from '../../../utils/validations';
import '../../../sass/employees.scss'
const DATEFORMAT = 'YYYY-MM-DD'

const ManageEmployee = () => {
    const { employeeId } = useParams()
    const history = useHistory()
    const { pathname } = useLocation()
    const [accountValues, setAccountValues] = useState({ loading: true })
    const [headerContent, setHeaderContent] = useState({})
    const [loading, setLoading] = useState(true)
    const [adharProof, setAdharProof] = useState({})
    const [licenseProof, setLicenseProof] = useState({})
    const [adharProofErrors, setAdharProofErrors] = useState({})
    const [licenseProofErrors, setLicenseProofErrors] = useState({})
    const [confirmModal, setConfirmModal] = useState(false)
    const [accountErrors, setAccountErrors] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [roleList, setRoleList] = useState([])
    const [shake, setShake] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [employeeType, setEmployeeType] = useState('')
    const [departmentList, setDepartmentList] = useState([])

    const isDriver = employeeType === 'Driver'
    const roleOptions = useMemo(() => getRoleOptions(roleList), [roleList])
    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const departmentOptions = useMemo(() => getDepartmentOptions(departmentList), [departmentList])
    const childProps = useMemo(() => ({ adharProof, licenseProof, adharProofErrors, licenseProofErrors, roleOptions, departmentOptions }),
        [adharProof, licenseProof, adharProofErrors, licenseProofErrors, roleOptions, departmentOptions])

    useEffect(() => {
        getEmployeeType(mainUrl)
        getEmployee()
    }, [])

    const getEmployee = async () => {
        const url = `${getUrl(mainUrl)}/${employeeId}`

        const [data] = await http.GET(url)
        const { adhar_frontside, adhar_backside, license_frontside, license_backside, ...rest } = data
        const { userName, adharNo, licenseNo } = rest
        const adharFront = base64String(adhar_frontside?.data)
        const adharBack = base64String(adhar_backside?.data)
        const licenseFront = base64String(license_frontside?.data)
        const licenseBack = base64String(license_backside?.data)
        const dob = getValidDate(rest.dob, DATEFORMAT)
        const joinedDate = getValidDate(rest.joinedDate, DATEFORMAT)

        setAdharProof({ Front: adharFront, Back: adharBack, idProofType: 'adharNo', adharNo })
        setLicenseProof({ Front: licenseFront, Back: licenseBack, idProofType: 'licenseNo', licenseNo })
        setHeaderContent({ title: userName })
        setAccountValues({ ...rest, dob, joinedDate })
        setLoading(false)
    }

    const getEmployeeType = (url) => {
        const type = url === '/staff' ? 'Staff' : 'Driver'
        setEmployeeType(type)
    }

    const getRoleList = async () => {
        const url = '/roles/getRoles'

        const data = await http.GET(url)
        setRoleList(data)
    }

    const getDepartmentList = async () => {
        const url = '/motherplant/getAllDepartmentsList'

        const data = await http.GET(url)
        setDepartmentList(data)
    }

    const handleChange = (value, key) => {
        setAccountValues(data => ({ ...data, [key]: value }))
        setAccountErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'adharNo' || key === 'licenseNo') {
            const error = validateIDNumbers(key, value)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'userName' || key === 'parentName') {
            const error = validateNames(value)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {

        // Validations
        if (key === 'adharNo' || key === 'licenseNo') {
            const error = validateIDNumbers(key, value, true)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'emailid') {
            const error = validateEmailId(value)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value, true)
            setAccountErrors(errors => ({ ...errors, [key]: error }))
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

    const handleUpdate = async () => {
        const adharProofErrors = validateIDProofs(adharProof)
        const licenseProofErrors = isDriver ? validateIDProofs(licenseProof) : {}
        const accountErrors = validateEmployeeValues(accountValues, employeeType)

        if (!isEmpty(accountErrors) || !isEmpty(adharProofErrors) || !isEmpty(licenseProofErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setAccountErrors(accountErrors)
            setAdharProofErrors(adharProofErrors)
            setLicenseProofErrors(licenseProofErrors)
            return
        }

        let body = {
            ...accountValues, adharProof, licenseProof
        }
        const url = updateUrl(mainUrl)
        const options = { item: employeeType, v1Ing: 'Updating', v2: 'updated' }


        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(url, body)
            showToast(options)
            goBack()
        } catch (error) {
            message.destroy()
            setBtnDisabled(false)
        }
    }

    const handleEdit = () => {
        if (!isDriver) {
            getRoleList()
        }
        getDepartmentList()
        setEditMode(true)
    }

    const onAccountCancel = useCallback(() => handleBack(), [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleConfirmModalOk = useCallback(() => { setConfirmModal(false); goBack() }, [])

    const handleBack = () => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged) {
            setConfirmModal(true)
        }
        else goBack()
    }

    const goBack = () => history.push(mainUrl)

    return (
        <Fragment>
            <ScrollUp dep={editMode} />
            <Header data={headerContent} onClick={handleBack} />
            <div className='app-manage-content employee-manage-content'>
                {
                    loading
                        ? <NoContent content={<Spinner />} />
                        : <>
                            <div className='employee-title-container'>
                                <span className='title'>{employeeType} Details</span>
                            </div>
                            {
                                editMode ? (
                                    <EmployeeForm
                                        data={accountValues}
                                        errors={accountErrors}
                                        title={employeeType}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        onUpload={handleProofUpload}
                                        onRemove={handleProofRemove}
                                        {...childProps}
                                    />
                                ) :
                                    <>
                                        <IDProofInfo data={adharProof} />
                                        {isDriver && <IDProofInfo data={licenseProof} />}
                                        <AccountView isDriver={isDriver} data={accountValues} />
                                    </>
                            }
                            <div className={`app-footer-buttons-container ${editMode ? 'edit' : 'view'}`}>
                                <CustomButton onClick={onAccountCancel} className='app-cancel-btn footer-btn' text='Cancel' />
                                {
                                    editMode
                                        ? <CustomButton onClick={handleUpdate} className={`app-create-btn footer-btn ${btnDisabled && 'disabled'} ${shake && 'app-shake'} `} text='Update' />
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
            <QuitModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </QuitModal>
        </Fragment>
    )
}

const getUrl = (url) => {
    const staffUrl = '/users/getUser'
    const driverUrl = '/driver/getDriver'

    if (url === '/staff') return staffUrl
    return driverUrl
}

const updateUrl = (url) => {
    const staffUrl = '/users/updateWebUser'
    const driverUrl = '/driver/updateDriver'

    if (url === '/staff') return staffUrl
    return driverUrl
}

export default ManageEmployee
