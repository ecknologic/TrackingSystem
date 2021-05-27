import axios from 'axios';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import React, { Fragment, useEffect, useState, useMemo } from 'react';
import AccountView from '../../views/Account';
import { http } from '../../../../modules/http'
import DistributorForm from '../../forms/Distributor';
import Spinner from '../../../../components/Spinner';
import ScrollUp from '../../../../components/ScrollUp';
import NoContent from '../../../../components/NoContent';
import IDProofInfo from '../../../../components/IDProofInfo';
import CustomButton from '../../../../components/CustomButton';
import { getDropdownOptions } from '../../../../assets/fixtures';
import { isEmpty, showToast, base64String, getBase64, getProductsForUI, getProductsWithIdForDB, extractDistributorDetails, extractProductsFromForm, resetTrackForm } from '../../../../utils/Functions';
import { validateNames, validateMobileNumber, validateEmailId, validateDistributorValues } from '../../../../utils/validations';
import '../../../../sass/employees.scss'

const ManageDistributor = ({ setHeaderContent, onGoBack }) => {
    const { distributorId } = useParams()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [gstProof, setGstProof] = useState({})
    const [locationList, setLocationList] = useState([])
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [editMode, setEditMode] = useState('')
    const [shake, setShake] = useState(false)

    const locationOptions = useMemo(() => getDropdownOptions(locationList), [locationList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getDistributor()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getDistributor = async () => {
        const url = `distributor/getDistributor/${distributorId}`

        try {
            const [data] = await http.GET(axios, url, config)
            const { products, ...rest } = data
            const { gstProof: gst, agencyName, gstNo } = rest
            const gstProof = base64String(gst?.data)
            const productsUI = getProductsForUI(products)

            setGstProof({ idProofType: 'gstNo', Front: gstProof, gstNo })
            setHeaderContent({ title: agencyName })
            setFormData({ ...rest, gstProof, ...productsUI })
            setLoading(false)
        } catch (error) { }
    }

    const getLocationList = async () => {
        const url = `bibo/getList/location`

        try {
            const data = await http.GET(axios, url, config)
            setLocationList(data)
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'agencyName' || key === 'operationalArea' || key === 'contactPerson') {
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
        if (key === 'mailId' || key === 'alternateMailId') {
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
            setFormData(data => ({ ...data, gstProof: buffer, isNewFile: true }))
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

        const productsUI = extractProductsFromForm(formData)
        const products = getProductsWithIdForDB(productsUI)
        const data = extractDistributorDetails(formData)

        let body = { ...data, products }
        if (!formData.isNewFile) {
            delete body.gstProof
        }
        const url = 'distributor/updateDistributor'
        const options = { item: 'Distributor', v1Ing: 'Updating', v2: 'updated' }

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
        getLocationList()
        setEditMode(true)
    }

    return (
        <Fragment>
            <ScrollUp dep={editMode} />
            <div className='app-manage-content employee-manage-content p-0'>
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
                                            locationOptions={locationOptions}
                                        />
                                    </>
                                ) :
                                    <>
                                        <IDProofInfo data={gstProof} />
                                        <AccountView data={formData} />
                                    </>
                            }
                            <div className={`app-footer-buttons-container ${editMode ? 'edit' : 'view'}`}>
                                <CustomButton onClick={onGoBack} className='app-cancel-btn footer-btn' text='Cancel' />
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
        </Fragment>
    )
}

export default ManageDistributor
