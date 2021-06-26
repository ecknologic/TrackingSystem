import dayjs from 'dayjs';
import axios from 'axios';
import { message, Checkbox } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import InvoiceForm from '../forms/Invoice';
import { http } from '../../../../modules/http';
import ProductsTable from '../forms/ProductsTable';
import InvoiceRestForm from '../forms/InvoiceRest';
import Spinner from '../../../../components/Spinner';
import useUser from '../../../../utils/hooks/useUser';
import { TODAYDATE } from '../../../../utils/constants';
import NoContent from '../../../../components/NoContent';
import CustomButton from '../../../../components/CustomButton';
import { validateNumber, validateInvoiceValues } from '../../../../utils/validations';
import { getProductOptions, getDDownOptions, getDCOptions, getDropdownOptions } from '../../../../assets/fixtures';
import { getProductsForTable, getProductTableResults, isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
const APIDATEFORMAT = 'YYYY-MM-DD'

const CreateInvoice = ({ goToTab, editMode, setHeader }) => {
    const defaultValues = useMemo(() => ({ invoiceDate: TODAYDATE, hsnCode: 22011010, departmentStatus: 'Pending' }), [])
    const history = useHistory()
    const { WAREHOUSEID } = useUser()
    const { invoiceId } = useParams()
    const [formData, setFormData] = useState(defaultValues)
    const [isLocal, setIsLocal] = useState(false)
    const [GSTList, setGSTList] = useState([])
    const [DCList, setDCList] = useState([])
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [productList, setProductList] = useState([])
    const [paymentList, setPaymentList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const [dataSource, setDataSource] = useState(editMode ? [] : initData)
    const [shake, setShake] = useState(false)
    const [deleted, setDeleted] = useState([])
    const [loading, setLoading] = useState(false)

    const DCOptions = useMemo(() => getDCOptions(DCList), [DCList])
    const GSTOptions = useMemo(() => getDDownOptions(GSTList), [GSTList])
    const paymentOptions = useMemo(() => getDropdownOptions(paymentList), [paymentList])
    const productOptions = useMemo(() => getProductOptions(productList), [productList])
    const footerValues = useMemo(() => computeFinalAmounts(dataSource), [dataSource])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }
    const { departmentStatus, customerType } = formData
    const isDistributor = customerType === 'distributor'

    useEffect(() => {
        if (editMode) getInvoice()
        else getInvoiceId()
        getCustomerList()
        getProductList()
        getPaymentList()
        getGSTList()
        getDCList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        const updatedData = dataSource.map((row) => ({ ...row, ...getProductTableResults(row, isLocal) }))
        setDataSource(updatedData)
    }, [isLocal])

    useEffect(() => {
        const isDistributor = customerType === 'distributor'
        if (isDistributor)
            handleCheckboxChange(false)
        else handleCheckboxChange(true)
    }, [customerType])

    const getInvoice = async () => {
        const url = `invoice/getInvoiceById/${invoiceId}`

        try {
            setLoading(true)
            const data = await http.GET(axios, url, config)
            const { products, ...rest } = data
            const { invoiceId } = rest
            setHeader({ title: `Invoice - ${invoiceId}` })
            setDataSource(products)
            setFormData(rest)
            setLoading(false)
        } catch (error) { }
    }

    const getInvoiceId = async () => {
        const url = `invoice/getInvoiceId?departmentId=${WAREHOUSEID}`

        try {
            const invoiceId = await http.GET(axios, url, config)
            setFormData(prev => ({ ...prev, invoiceId }))
        } catch (error) { }
    }

    const getGSTList = async () => {
        const url = `bibo/getList/gst`

        try {
            const data = await http.GET(axios, url, config)
            setGSTList(data)
        } catch (error) { }
    }

    const getDCList = async () => {
        const url = `warehouse/getDCList`

        try {
            const data = await http.GET(axios, url, config)
            setDCList(data)
        } catch (error) { }
    }

    const getProductList = async () => {
        const url = 'products/getProducts'

        try {
            const data = await http.GET(axios, url, config)
            setProductList(data)
        } catch (error) { }
    }

    const getCustomerList = async () => {
        const url = 'customer/getCustomerNames'

        try {
            const data = await http.GET(axios, url, config)
            setCustomerList(data)
        } catch (error) { }
    }

    const getPaymentList = async () => {
        const url = `bibo/getList/paymentMode`

        try {
            const data = await http.GET(axios, url, config)
            setPaymentList(data)
        } catch (error) { }
    }

    const getDCByCustomerOrderId = async (id) => {
        const url = `warehouse/getDCDetailsByCOId/${id}`

        try {
            let isLocal = true
            showToast({ v1Ing: 'Fetching', action: 'loading' })
            const [dc] = await http.GET(axios, url, config)
            const { existingCustomerId, distributorId, customerType } = dc
            const customerId = existingCustomerId || distributorId

            if (!dc.gstNo) setIsLocal(true)
            else if ((dc.gstNo || "").startsWith('36')) setIsLocal(true)
            else { setIsLocal(false); isLocal = false }

            setFormData(data => ({ ...data, ...dc, customerId, paymentMode: null, departmentStatus }))
            const data = getProductsForTable(productList, dc, isLocal)
            setDataSource(data)
            showToast({ v2: 'fetched' })
        } catch (error) {
            message.destroy()
        }
    }

    const resetProductErr = () => setFormErrors(errors => ({ ...errors, products: '' }))

    const handleAddProduct = () => {
        resetProductErr()
        const newData = { ...initData()[0], key: uuidv4().slice(0, 7), isNew: editMode ? 1 : 0 };
        setDataSource([...dataSource, newData])
    };

    const handleProductsDelete = (key) => {
        resetProductErr()
        if (editMode) {
            deleted.push(key)
            setDeleted(deleted)
        }
        const filtered = dataSource.filter((item) => item.key !== key)
        setDataSource(filtered)
    }

    const handleProductsSave = (row, dataIndex) => {
        resetProductErr()
        const rowFinal = onSave(row, dataIndex)
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...rowFinal });
        setDataSource(newData)
    };

    const onSave = (row, dataIndex) => {
        if (dataIndex === 'productName') {
            const { tax, price: productPrice } = productList.find(item => item.productName === row.productName)
            const newRow = { ...row, productPrice, tax }
            row = { ...newRow, ...getProductTableResults(newRow, isLocal) }
        }
        else {
            const newRow = { ...row }
            row = { ...newRow, ...getProductTableResults(newRow, isLocal) }
        }

        return row
    };

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'dcNo') {
            const { customerOrderId } = DCList.find(item => item.dcNo === value)
            getDCByCustomerOrderId(customerOrderId)
        }

        // Validations
        if (key === 'hsnCode' || key === 'poNo') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleCheckboxChange = (checked) => {
        const status = checked ? 'InProgress' : 'Pending'
        const departmentStatus = checked ? 'Paid' : 'Pending'
        setFormData(data => ({ ...data, departmentStatus, status }))

        if (!checked) {
            setFormData(data => ({ ...data, paymentMode: null }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateInvoiceValues({ ...formData, products: dataSource }, true);
        const { totalAmount } = footerValues
        const { EmailId: emailId, invoiceDate, dueDate, fromDate, toDate, address, deliveryAddress,
            createdBy: salesPerson } = formData

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        const products = dataSource.map((item) => ({ ...item, address, deliveryAddress }))

        if (editMode && !isEmpty(deleted)) {
            const url = 'invoice/deleteInvoiceProducts'
            const body = { deleted }
            try {
                http.PUT(axios, url, body, config)
            } catch (error) { }
        }

        let body = {
            ...formData, invoiceDate: dayjs(invoiceDate).format(APIDATEFORMAT),
            fromDate: dayjs(fromDate).format(APIDATEFORMAT), toDate: dayjs(toDate).format(APIDATEFORMAT),
            mailIds: emailId, products, dueDate: dayjs(dueDate).format(APIDATEFORMAT),
            totalAmount, salesPerson
        }

        const url = getUrl(editMode)
        const options = { item: 'Invoice', ...getVerbs(editMode) }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            if (!editMode) {
                resetForm()
                goToTab('1')
                getInvoiceId()
            } else {
                history.push('/invoices')
            }
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
                if (error.response.status === 400) {
                    message.info('Invoice already generated for this DC')
                }
            }
        }
    }

    const resetForm = () => {
        setBtnDisabled(false)
        resetTrackForm()
        setFormData(defaultValues)
        setDataSource(initData)
        setFormErrors({})
    }

    if (loading) return <NoContent content={<Spinner />} />

    return (
        <div className='stock-delivery-container'>
            <div className='invoice-title-container'>
                <span className='title'>{`${editMode ? '' : 'New'} Invoice Details`}</span>
            </div>
            <InvoiceForm
                data={formData}
                errors={formErrors}
                DCOptions={DCOptions}
                customerList={customerList}
                onChange={handleChange}
            />
            <ProductsTable
                errors={formErrors}
                dataSource={dataSource}
                GSTOptions={GSTOptions}
                footerValues={footerValues}
                productOptions={productOptions}
                onAdd={handleAddProduct}
                onSave={handleProductsSave}
                onDelete={handleProductsDelete}
            />
            {
                !isDistributor &&
                <div className='checkbox-container'>
                    <div>
                        <Checkbox
                            checked={departmentStatus === 'Pending' ? false : true}
                            disabled={!isDistributor}
                            onChange={({ target: { checked } }) => handleCheckboxChange(checked)}
                        />
                        <span className='app-checkbox-text'>Customer has paid the amount?</span>
                    </div>
                </div>
            }
            <InvoiceRestForm
                data={formData}
                errors={formErrors}
                hasPaid={departmentStatus === 'Pending' ? false : true}
                paymentOptions={paymentOptions}
                onChange={handleChange}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    disabled={btnDisabled}
                    className={`
                    app-create-btn footer-btn
                    ${shake ? 'app-shake' : ''}
                `}
                    text={editMode ? 'Update' : 'Create'}
                />
            </div>
        </div>
    )
}

const getVerbs = (editMode) => {
    let v1Ing = 'Creating'
    let v2 = 'added'
    if (editMode) {
        v1Ing = 'Updating'
        v2 = 'updated'
    }

    return { v1Ing, v2 }
}
const getUrl = (editMode) => {
    const createUrl = 'invoice/createDepartmentInvoice'
    const updateUrl = 'invoice/updateInvoice'
    return editMode ? updateUrl : createUrl
}
const initData = () => ([{
    key: uuidv4().slice(0, 7),
    productName: null,
    quantity: 1,
    productPrice: 0,
    discount: 0, tax: 18,
    amount: 0, cgst: 0,
    sgst: 0, igst: 0
}])

const computeFinalAmounts = (data) => {
    let subTotal = 0, cgstAmount = 0, sgstAmount = 0, igstAmount = 0;
    data.map((item) => {
        subTotal = Number((subTotal + Number(item.amount)).toFixed(2))
        cgstAmount = Number((cgstAmount + item.cgst).toFixed(2))
        sgstAmount = Number((sgstAmount + item.sgst).toFixed(2))
        igstAmount = Number((igstAmount + item.igst).toFixed(2))
    })
    const totalAmount = Math.round((subTotal + cgstAmount + sgstAmount + igstAmount))

    return { subTotal, cgstAmount, sgstAmount, igstAmount, totalAmount }
}
export default CreateInvoice

