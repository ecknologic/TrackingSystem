import axios from 'axios';
import { message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import VendorForm from '../forms/Vendor';
import { http } from '../../../modules/http';
import CustomButton from '../../../components/CustomButton';
import { getDropdownOptions } from '../../../assets/fixtures';
import { isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { validateClosureAccValues, validateVendorValues, validateIFSCCode, validateNames, validateNumber, validateMultiOptions } from '../../../utils/validations';

const CreateEnquiry = ({ goToTab }) => {
    const [formData, setFormData] = useState({})
    const [accData, setAccData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [accErrors, setAccErrors] = useState({})
    const [itemsSupplied, setItemsSupplied] = useState([])
    const [supplyList, setSupplyList] = useState([])
    const [SUPPLIES, setSUPPLIES] = useState([])
    const [suppliesCount, setSuppliesCount] = useState(0)
    const [supplyErrors, setSupplyErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [shake, setShake] = useState(false)

    const supplyOptions = useMemo(() => getDropdownOptions(supplyList), [supplyList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getSupplyList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getSupplyList = async () => {
        const url = 'bibo/getList/itemName'

        try {
            const data = await http.GET(axios, url, config)
            setSuppliesCount(data.length)
            setSupplyList([{ value: 'ALL', name: 'ALL' }, ...data])
            setSUPPLIES(['ALL', ...data.map(item => item.value)])
        } catch (error) { }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'contactPerson') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'creditPeriod') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleAccChange = (value, key) => {
        setAccData(data => ({ ...data, [key]: value }))
        setAccErrors(errors => ({ ...errors, [key]: '' }))
    }

    const handleAccBlur = (value, key) => {

        // Validations
        if (key === 'ifscCode') {
            const error = validateIFSCCode(value, true)
            setAccErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSupplySelect = (value) => {
        setSupplyErrors({ itemsSupplied: '' })
        if (value == 'ALL') setItemsSupplied(SUPPLIES)
        else {
            const clone = [...itemsSupplied]
            clone.push(value)
            if (clone.length === suppliesCount) clone.push('ALL')
            setItemsSupplied(clone)
        }
    }

    const handleSupplyDeselect = (value) => {
        if (value == 'ALL') setItemsSupplied([])
        else {
            const filtered = itemsSupplied.filter(item => item !== value && item !== "ALL")
            setItemsSupplied(filtered)
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateVendorValues(formData)
        const accErrors = validateClosureAccValues(accData)
        const supplyErrors = validateMultiOptions(itemsSupplied, 'itemsSupplied')

        if (!isEmpty(formErrors) || !isEmpty(supplyErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            setAccErrors(accErrors)
            setSupplyErrors(supplyErrors)
            return
        }

        const body = { ...formData, ...accData, itemsSupplied: itemsSupplied.filter((item) => item !== 'ALL').join(',') }
        const url = 'vendors/createVendor'
        const options = { item: 'Vendor', v1Ing: 'Adding', v2: 'added' }

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
        setAccData({})
        setAccErrors({})
    }

    return (
        <div className='employee-manager-content'>
            <div className='employee-title-container'>
                <span className='title'>New Vendor Form</span>
            </div>
            <VendorForm
                data={formData}
                accData={accData}
                errors={formErrors}
                accErrors={accErrors}
                supplyErrors={supplyErrors}
                itemsSupplied={itemsSupplied}
                supplyOptions={supplyOptions}
                onAccBlur={handleAccBlur}
                onChange={handleChange}
                onAccChange={handleAccChange}
                onSelect={handleSupplySelect}
                onDeselect={handleSupplyDeselect}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    disabled={btnDisabled}
                    className={`
                    app-create-btn footer-btn
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Add'
                />
            </div>
        </div>
    )
}

export default CreateEnquiry