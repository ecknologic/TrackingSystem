import axios from 'axios';
import { Menu, message, Table } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ProductForm from '../forms/Product';
import { http } from '../../../modules/http'
import Actions from '../../../components/Actions';
import Spinner from '../../../components/Spinner';
import { TRACKFORM } from '../../../utils/constants';
import ConfirmMessage from '../../../components/ConfirmMessage';
import CustomModal from '../../../components/CustomModal';
import { productColumns } from '../../../assets/fixtures';
import { EditIconGrey, HomeIconGrey } from '../../../components/SVG_Icons';
import ConfirmModal from '../../../components/CustomModal';
import { deepClone, isAlphaNum, isEmpty, resetTrackForm, showToast } from '../../../utils/Functions';
import { validateIntFloat, validateNumber, validateProductValues } from '../../../utils/validations';

const Dashboard = ({ reFetch }) => {
    const [products, setProducts] = useState([])
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [editModal, setEditModal] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [shake, setShake] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        getProducts()
    }, [reFetch])

    const getProducts = async () => {
        const url = 'products/getProducts'

        try {
            const data = await http.GET(axios, url, config)
            setProducts(data)
            setLoading(false)
        } catch (error) { }
    }

    const handleMenuSelect = (key, data) => {
        if (key === 'edit') {
            setFormData(data)
            setEditModal(true)
        }
        else if (key === 'outOfStock') {
            handleStatusUpdate(data, 'OUTOFSTOCK')
        }
        else if (key === 'inStock') {
            handleStatusUpdate(data, 'AVIALABLE')
        }
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        // Validations
        if (key === 'productName') {
            const isValid = isAlphaNum(value)
            if (!isValid) setFormErrors(errors => ({ ...errors, [key]: 'Enter aphanumeric only' }))
        }
        else if (key === 'price' || key === 'tax') {
            const error = validateIntFloat(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'hsnCode') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleBlur = (value, key) => {

        // Validations
        if (key === 'price' || key === 'tax') {
            const error = validateIntFloat(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleSubmit = async () => {
        const formErrors = validateProductValues(formData)

        if (!isEmpty(formErrors)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(formErrors)
            return
        }

        let body = { ...formData }
        const url = 'products/updateProduct'
        const options = { item: 'Product', v1Ing: 'Updating', v2: 'updated' }

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            showToast(options)
            optimisticUpdate(formData)
            onModalClose(true)
        } catch (error) {
            message.destroy()
            if (!axios.isCancel(error)) {
                setBtnDisabled(false)
            }
        }
    }

    const handleStatusUpdate = async ({ productId }, status) => {
        const options = { item: 'Product status', v1Ing: 'Updating', v2: 'updated' }
        const url = 'products/updateProductStatus'
        const body = { status, productId }
        try {
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            optimisticKeyUpdate(productId, status, 'status')
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const optimisticKeyUpdate = (id, value, key) => {
        let clone = deepClone(products);
        const index = clone.findIndex(item => item.productId === id)
        clone[index][key] = value;
        setProducts(clone)
    }

    const onModalClose = (hasUpdated) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasUpdated) {
            return setConfirmModal(true)
        }
        setEditModal(false)
        setFormData({})
        setFormErrors({})
        resetTrackForm()
        setBtnDisabled(false)
    }

    const optimisticUpdate = (data) => {
        let clone = deepClone(products);
        const index = clone.findIndex(item => item.productId === data.productId)
        const { price, tax } = data
        const totalAmount = (price * tax) / 100 + Number(price)
        data.totalAmount = totalAmount.toFixed(2)
        clone[index] = data;
        setProducts(clone)
    }

    const dataSource = useMemo(() => products.map((product) => {
        const { productId: key, productName, price, tax, totalAmount, hsnCode, status } = product

        let options = [
            <Menu.Item key="edit" icon={<EditIconGrey />}>Edit</Menu.Item>,
        ]

        if (status === 'OUTOFSTOCK') {
            options = [...options, <Menu.Item key="inStock" icon={<HomeIconGrey />}>In Stock</Menu.Item>]
        }
        else {
            options = [...options, <Menu.Item key="outOfStock" icon={<HomeIconGrey />}>Out Of Stock</Menu.Item>]
        }

        return {
            key,
            price,
            tax,
            hsnCode,
            totalAmount,
            productName,
            action: <Actions options={options} onSelect={({ key }) => handleMenuSelect(key, product)} />
        }
    }), [products])

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false)
        resetTrackForm()
        onModalClose()
    }, [])
    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleModalCancel = useCallback(() => onModalClose(), [])

    return (
        <div className='product-container employee-manager-content'>
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource}
                    columns={productColumns}
                    pagination={false}
                    scroll={{ x: true }}
                />
            </div>
            <CustomModal
                okTxt='Update'
                title='Product Details'
                visible={editModal}
                btnDisabled={btnDisabled}
                onOk={handleSubmit}
                onCancel={handleModalCancel}
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
            >
                <ProductForm
                    data={formData}
                    errors={formErrors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </CustomModal>
            <ConfirmModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </ConfirmModal>
        </div>
    )
}

export default Dashboard
