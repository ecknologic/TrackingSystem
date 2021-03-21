import dayjs from 'dayjs';
import axios from 'axios';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import InvoiceForm from '../forms/Invoice';
import { http } from '../../../../modules/http';
import ProductsTable from '../forms/ProductsTable';
import InvoiceRestForm from '../forms/InvoiceRest';
import Spinner from '../../../../components/Spinner';
import { TODAYDATE } from '../../../../utils/constants';
import NoContent from '../../../../components/NoContent';
import CustomButton from '../../../../components/CustomButton';
import { isEmpty, resetTrackForm, showToast } from '../../../../utils/Functions';
import { validateNumber, validateInvoiceValues } from '../../../../utils/validations';
import { getProductOptions, getDDownOptions, getDCOptions } from '../../../../assets/fixtures';
const APIDATEFORMAT = 'YYYY-MM-DD'

const CreateInvoice = ({ goToTab, editMode, setHeader }) => {
    const defaultValues = useMemo(() => ({ invoiceDate: TODAYDATE, hsnCode: 22011010 }), [])
    const history = useHistory()
    const { invoiceId } = useParams()
    const [formData, setFormData] = useState(defaultValues)
    const [GSTList, setGSTList] = useState([])
    const [DCList, setDCList] = useState([])
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [productList, setProductList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const [billingAddress, setBillingAddress] = useState({})
    const [dataSource, setDataSource] = useState(editMode ? [] : initData)
    const [shake, setShake] = useState(false)
    const [deleted, setDeleted] = useState([])
    const [loading, setLoading] = useState(false)

    const DCOptions = useMemo(() => getDCOptions(DCList), [DCList])
    const GSTOptions = useMemo(() => getDDownOptions(GSTList), [GSTList])
    const productOptions = useMemo(() => getProductOptions(productList), [productList])
    const footerValues = useMemo(() => computeFinalAmounts(dataSource), [dataSource])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        if (editMode) getInvoice()
        else getInvoiceId()
        getCustomerList()
        getProductList()
        getGSTList()
        getDCList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getInvoice = async () => {
        const url = `/invoice/getInvoiceById/${invoiceId}`

        try {
            setLoading(true)
            const data = await http.GET(axios, url, config)
            const { products, ...rest } = data
            const { invoiceId, customerId } = rest
            setHeader({ title: `Invoice - ${invoiceId}` })
            setDataSource(products)
            setFormData(rest)
            setLoading(false)
        } catch (error) { }
    }

    const getInvoiceId = async () => {
        const url = '/invoice/getInvoiceId'

        try {
            const invoiceId = await http.GET(axios, url, config)
            setFormData(prev => ({ ...prev, invoiceId }))
        } catch (error) { }
    }

    const getGSTList = async () => {
        const url = `/bibo/getList/gst`

        try {
            const data = await http.GET(axios, url, config)
            setGSTList(data)
        } catch (error) { }
    }

    const getDCList = async () => {
        const url = `/warehouse/getDCList`

        try {
            const data = await http.GET(axios, url, config)
            setDCList(data)
        } catch (error) { }
    }

    const getProductList = async () => {
        const url = '/products/getProducts'

        try {
            const data = await http.GET(axios, url, config)
            setProductList(data)
        } catch (error) { }
    }

    const getCustomerList = async () => {
        const url = '/customer/getCustomerNames'

        try {
            const data = await http.GET(axios, url, config)
            setCustomerList(data)
        } catch (error) { }
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
            row = { ...newRow, ...getResults(newRow) }
        }
        else {
            const newRow = { ...row }
            row = { ...newRow, ...getResults(newRow) }
        }

        return row
    };

    const getResults = (row) => {
        const { isLocal } = billingAddress
        let { quantity, productPrice, discount, tax, cgst, sgst, igst } = row
        const priceAfterDiscount = productPrice - (productPrice / 100 * discount)
        const amount = Number((priceAfterDiscount * quantity).toFixed(2))
        const totalTax = (amount / 100 * tax)
        cgst = isLocal ? Number((totalTax / 2).toFixed(2)) : 0.00
        sgst = isLocal ? Number((totalTax / 2).toFixed(2)) : 0.00
        igst = isLocal ? 0.00 : Number((totalTax).toFixed(2))
        return { amount, cgst, sgst, igst }
    };

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'dcNo') {
            const customerName = DCList.find(item => item.dcNo === value).customerName
            setFormData(data => ({ ...data, customerName }))
        }

        // Validations
        if (key === 'hsnCode' || key === 'poNo') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateInvoiceValues({ ...formData, products: dataSource }, true);
        const { EmailId: emailId, customerName, panNo, mobileNumber, address, gstNo } = billingAddress
        const { totalAmount } = footerValues
        const { invoiceDate, dueDate, fromDate, toDate } = formData

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }


        if (editMode && !isEmpty(deleted)) {
            const url = '/invoice/deleteInvoiceProducts'
            const body = { deleted }
            try {
                http.PUT(axios, url, body, config)
            } catch (error) { }
        }

        let body = {
            ...formData, invoiceDate: dayjs(invoiceDate).format(APIDATEFORMAT),
            fromDate: dayjs(fromDate).format(APIDATEFORMAT), toDate: dayjs(toDate).format(APIDATEFORMAT),
            mailIds: emailId, products: dataSource, dueDate: dayjs(dueDate).format(APIDATEFORMAT),
            totalAmount, customerName, panNo, mobileNumber, address, gstNo
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
            <InvoiceRestForm
                data={formData}
                errors={formErrors}
                billingAddress={billingAddress}
                onChange={handleChange}
            />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleSubmit}
                    className={`
                    app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
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
    const createUrl = '/invoice/createInvoice'
    const updateUrl = '/invoice/updateInvoice'
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

