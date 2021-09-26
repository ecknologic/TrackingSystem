import axios from 'axios';
import dayjs from 'dayjs';
import { message } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import React, { Fragment, useEffect, useState, useMemo } from 'react';
import AccountView from '../../views/Account';
import { http } from '../../../../modules/http'
import EnquiryForm from '../../forms/Enquiry';
import Spinner from '../../../../components/Spinner';
import ScrollUp from '../../../../components/ScrollUp';
import NoContent from '../../../../components/NoContent';
import CustomButton from '../../../../components/CustomButton';
import { MARKETINGADMIN, DATEFORMAT } from '../../../../utils/constants';
import { getDropdownOptions, getStaffOptions } from '../../../../assets/fixtures';
import { validateMobileNumber, validateEmailId, validateEnquiryValues } from '../../../../utils/validations';
import { isEmpty, showToast, getProductsForUI, getProductsWithIdForDB, extractProductsFromForm, resetTrackForm, getLabel, isStatus404 } from '../../../../utils/Functions';
import '../../../../sass/employees.scss'

const ManageDistributor = ({ setHeaderContent, onGoBack }) => {
    const history = useHistory()
    const { enquiryId } = useParams()
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [editMode, setEditMode] = useState('')
    const [shake, setShake] = useState(false)
    const [agentList, setAgentList] = useState([])
    const [businessList, setBusinessList] = useState([])

    const agentOptions = useMemo(() => getStaffOptions(agentList), [agentList])
    const businessOptions = useMemo(() => getDropdownOptions(businessList), [businessList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getDistributor()

        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        if (editMode) {
            getAgentList()
            getBusinessList()
        }
    }, [editMode])

    const getAgentList = async () => {
        const url = `users/getUsersByRole/${MARKETINGADMIN}`

        try {
            const data = await http.GET(axios, url, config)
            setAgentList(data)
        } catch (error) { }
    }
    const getBusinessList = async () => {
        const url = `bibo/getList/natureOfBusiness`

        try {
            const data = await http.GET(axios, url, config)
            setBusinessList(data)
        } catch (error) { }
    }

    const getDistributor = async () => {
        const url = `customer/getCustomerEnquiry/${enquiryId}`

        try {
            const [data] = await http.GET(axios, url, config)
            const { products, ...rest } = data
            const { customerName } = rest
            const productsUI = getProductsForUI(products)

            setHeaderContent({ title: customerName })
            setFormData({ ...rest, ...productsUI })
            setLoading(false)
        } catch (error) {
            if (isStatus404(error)) {
                history.replace('/not-found', { entity: 'customer' })
            }
        }
    }

    const handleChange = (value, key, label, labelKey) => {
        setFormData(data => ({ ...data, [key]: value, ...getLabel(labelKey, label) }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (value === 'notintrested') {
            setFormData(data => ({ ...data, revisitDate: '' }))
        }

        // Validations
        if (key === 'mobileNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {

        // Validations
        if (key === 'EmailId') {
            const error = validateEmailId(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'mobileNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }


    const handleUpdate = async () => {
        const formErrors = validateEnquiryValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const productsUI = extractProductsFromForm(formData)
        const products = getProductsWithIdForDB(productsUI)
        const revisitDate = formData.revisitDate ? dayjs(formData.revisitDate).format(DATEFORMAT) : null

        let body = { ...formData, revisitDate, products }
        const url = 'customer/updateCustomerEnquiry'
        const options = { item: 'Enquiry', v1Ing: 'Updating', v2: 'updated' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
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
                                <span className='title'>Enquiry Details</span>
                            </div>
                            {
                                editMode ? (
                                    <>
                                        <EnquiryForm
                                            data={formData}
                                            errors={formErrors}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            agentOptions={agentOptions}
                                            businessOptions={businessOptions}
                                        />
                                    </>
                                ) :
                                    <>
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
