import axios from 'axios';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useMemo, useState } from 'react';
import InvoiceForm from '../forms/Invoice';
import { http } from '../../../modules/http';
import Spinner from '../../../components/Spinner';
import ProductsTable from '../forms/ProductsTable';
import InvoiceRestForm from '../forms/InvoiceRest';
import { TODAYDATE } from '../../../utils/constants';
import NoContent from '../../../components/NoContent';
import CustomButton from '../../../components/CustomButton';
import { isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { validateNumber, validateInvoiceValues } from '../../../utils/validations';
import { getProductOptions, getCustomerOptions, getStaffOptions, getDDownOptions } from '../../../assets/fixtures';

const CreateInvoice = ({ goToTab, editMode }) => {
    const defaultValues = useMemo(() => ({ invoiceDate: TODAYDATE }), [])
    const [formData, setFormData] = useState(defaultValues)
    const [GSTList, setGSTList] = useState([])
    const [formErrors, setFormErrors] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [productList, setProductList] = useState([])
    const [salesPersonList, setSalesPersonList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const [invoiceNumber, setInvoiceNumber] = useState(null)
    const [billingAddress, setBillingAddress] = useState({})
    const [dataSource, setDataSource] = useState(initData)
    const [shake, setShake] = useState(false)
    const [loading, setLoading] = useState(false)

    const GSTOptions = useMemo(() => getDDownOptions(GSTList), [GSTList])
    const productOptions = useMemo(() => getProductOptions(productList), [productList])
    const salesPersonOptions = useMemo(() => getStaffOptions(salesPersonList), [salesPersonList])
    const customerOptions = useMemo(() => getCustomerOptions(customerList), [customerList])
    const footerValues = useMemo(() => computeFinalAmounts(dataSource), [dataSource])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        if (editMode) {
            getInvoice()
        }
    }, [])

    useEffect(() => {
        getCustomerList()
        getSalesPersonList()
        getInvoiceNumber()
        getProductList()
        getGSTList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        handleCustomerChange()
    }, [billingAddress.isLocal])

    const getInvoice = async () => {
        setLoading(true)
        // const url = '/invoice/getInvoiceId'

        // try {
        //     const data = await http.GET(axios, url, config)
        //     setInvoiceNumber(data)
        // } catch (error) { }
    }

    const getInvoiceNumber = async () => {
        const url = '/invoice/getInvoiceId'

        try {
            const data = await http.GET(axios, url, config)
            setInvoiceNumber(data)
        } catch (error) { }
    }

    const getSalesPersonList = async () => {
        const url = '/customer/getSalesPersons'

        try {
            const data = await http.GET(axios, url, config)
            setSalesPersonList(data)
        } catch (error) { }
    }

    const getGSTList = async () => {
        const url = `/bibo/getList/gst`

        try {
            const data = await http.GET(axios, url, config)
            setGSTList(data)
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

    const getBillingAddress = async (customerId) => {
        setBillingAddress({ loading: true })
        const url = `/customer/getCustomerBillingAddress/${customerId}`

        try {
            const data = await http.GET(axios, url, config)
            setBillingAddress({ loading: false, ...data, loaded: true })
        } catch (error) { }
    }

    const resetProductErr = () => setFormErrors(errors => ({ ...errors, products: '' }))

    const handleAddProduct = () => {
        resetProductErr()
        const newData = { ...initData()[0], key: uuidv4().slice(0, 7) };
        setDataSource([...dataSource, newData])
    };

    const handleProductsDelete = (key) => {
        resetProductErr()
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

    const handleCustomerChange = () => {
        const newData = dataSource.map((item) => {
            const newItem = { ...item, ...getResults(item) }
            return newItem
        })
        setDataSource(newData)
    }

    const getResults = (row) => {
        const { isLocal } = billingAddress
        let { quantity, productPrice, discount, tax, cgst, sgst, igst } = row
        const priceAfterDiscount = productPrice - (productPrice / 100 * discount)
        const taxAmount = (priceAfterDiscount / 100 * tax)
        const priceAfterTax = priceAfterDiscount + taxAmount
        const amount = Number((priceAfterTax * quantity).toFixed(2))
        cgst = isLocal ? Number((taxAmount * tax / 200).toFixed(2)) : 0.00
        sgst = isLocal ? Number((taxAmount * tax / 200).toFixed(2)) : 0.00
        igst = isLocal ? 0.00 : Number((taxAmount * tax / 100).toFixed(2))
        return { amount, cgst, sgst, igst }
    };

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'customerId') {
            getBillingAddress(value)
        }

        // Validations
        if (key === 'hsnCode' || key === 'poNo') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateInvoiceValues({ ...formData, products: dataSource });
        const { EmailId: emailId } = billingAddress
        const { totalAmount } = footerValues

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let body = {
            ...formData, invoiceNumber,
            mailIds: emailId, products: dataSource,
            totalAmount
        }
        const url = '/invoice/createInvoice'
        const options = { item: 'Invoice', v1Ing: 'Creating', v2: 'created' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            goToTab('1')
            resetForm()
            getInvoiceNumber()
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
                customerList={customerList}
                invoiceNumber={invoiceNumber}
                billingAddress={billingAddress}
                customerOptions={customerOptions}
                salesPersonOptions={salesPersonOptions}
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
                    text='Create'
                />
            </div>
        </div>
    )
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
    const totalAmount = Number((subTotal + cgstAmount + sgstAmount + igstAmount).toFixed(2))

    return { subTotal, cgstAmount, sgstAmount, igstAmount, totalAmount }
}
export default CreateInvoice

