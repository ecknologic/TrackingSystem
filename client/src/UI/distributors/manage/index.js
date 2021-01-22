import { message } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import React, { Fragment, useEffect, useState, useCallback } from 'react';
import Header from './header';
import AccountView from '../views/Account';
import { http } from '../../../modules/http'
import DistributorForm from '../forms/Distributor';
import Spinner from '../../../components/Spinner';
import ScrollUp from '../../../components/ScrollUp';
import NoContent from '../../../components/NoContent';
import QuitModal from '../../../components/CustomModal';
import IDProofInfo from '../../../components/IDProofInfo';
import CustomButton from '../../../components/CustomButton';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { isEmpty, showToast, base64String, getBase64 } from '../../../utils/Functions';
import { TRACKFORM } from '../../../utils/constants';
import { validateIDNumbers, validateNames, validateMobileNumber, validateEmailId, validateDistributorValues } from '../../../utils/validations';
import '../../../sass/employees.scss'

const ManageDistributor = () => {
    const { distributorId } = useParams()
    const history = useHistory()
    const [headerContent, setHeaderContent] = useState({})
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [gstProof, setGstProof] = useState({})
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [editMode, setEditMode] = useState('')

    useEffect(() => {
        getDistributor()
    }, [])

    const getDistributor = async () => {
        const url = `/distributor/getDistributor/${distributorId}`
        const [data] = await http.GET(url)
        const { gstProof: gst, agencyName, gstNo } = data
        const gstProof = base64String(gst?.data)

        setGstProof({ idProofType: 'gstNo', Front: gstProof, gstNo })
        setHeaderContent({ title: agencyName })
        setFormData({ ...data, gstProof })
        setLoading(false)
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'agencyName' || key === 'operationalArea' || key === 'contactPerson') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber' || key === 'alternateNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {

        // Validations
        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mailId' || key === 'alternateMailId') {
            const error = validateEmailId(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber' || key === 'alternateNumber') {
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

    const handleUpdate = async () => {
        const formErrors = validateDistributorValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let body = { ...formData }
        const url = '/distributor/updateDistributor'
        const options = { item: 'Distributor', v1Ing: 'Updating', v2: 'updated' }

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

    const handleEdit = () => setEditMode(true)
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

    const goBack = () => history.push('/distributors')

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
                                <span className='title'>Distributor Details</span>
                            </div>
                            {
                                editMode ? (
                                    <>
                                        <DistributorForm
                                            data={formData}
                                            errors={formErrors}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            onUpload={handleUpload}
                                            onRemove={handleRemove}
                                        />
                                    </>
                                ) :
                                    <>
                                        <IDProofInfo data={gstProof} />
                                        <AccountView data={formData} />
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

export default ManageDistributor
