import { Tabs } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { getRouteOptions, getWarehouseOptions, WEEKDAYS } from '../../../assets/fixtures';
import ConfirmMessage from '../../../components/ConfirmMessage';
import QuitModal from '../../../components/CustomModal';
import Overview from './tabs/AccountOverview';
import { TRACKFORM } from '../../../utils/constants';
import { http } from '../../../modules/http';
import Header from './header';
import { validateDeliveryValues, validateDevDays, validateIDNumbers, validateMobileNumber, validateNames, validateNumber } from '../../../utils/validations';
import { extractDeliveryDetails, getProductsForDB, extractProductsFromForm, isEmpty, getDevDaysForDB, getBase64, resetTrackForm, showToast, getMainPathname } from '../../../utils/Functions';

const ViewAccount = () => {
    const history = useHistory()
    const { departmentId, departmentType } = useParams()
    const { pathname } = useLocation()
    const [account, setAccount] = useState({ loading: true })
    const [headerContent, setHeaderContent] = useState({})
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [viewModal, setViewModal] = useState(false)
    const [devDays, setDevDays] = useState([])
    const [devDaysError, setDevDaysError] = useState({})
    const [warehouseList, setWarehouseList] = useState([])
    const [routeList, setRouteList] = useState([])
    const [recentDelivery, setRecentDelivery] = useState({})
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [currentDepId, setCurrentDepId] = useState('')
    const [shake, setShake] = useState(false)
    const [navigateTo, setNavigateTo] = useState('')
    const [activeTab, setActiveTab] = useState('1')

    const routeOptions = useMemo(() => getRouteOptions(routeList), [routeList])
    const warehouseOptions = useMemo(() => getWarehouseOptions(warehouseList), [warehouseList])
    useEffect(() => {
        getAccount()
        getWarehouseList()
    }, [])

    const getAccount = async () => {
        let url = `/motherPlant/getMotherPlantById/${departmentId}`
        if (departmentType == 'warehouse') url = `/warehouse/getWarehouseById/${departmentId}`
        try {
            const data = await http.GET(url)
            const { departmentName } = data[0]
            setAccount({ ...data[0], loading: false })
            setHeaderContent({
                title: departmentName
            })
        } catch (error) { }
    }

    const getWarehouseList = async () => {
        try {
            const data = await http.GET('/motherPlant/getDepartmentsList?departmentType=warehouse')
            setWarehouseList(data)
        } catch (ex) { }
    }

    const getRouteList = async (departmentId) => {
        const data = await http.GET(`/customer/getRoutes/${departmentId}`)
        setRouteList(data)
        setCurrentDepId(departmentId)
    }

    const handleDevDaysSelect = (value) => {
        setDevDaysError({ devDays: '' })
        if (value == 'ALL') setDevDays(WEEKDAYS)
        else {
            const clone = [...devDays]
            clone.push(value)
            if (clone.length === 7) clone.push('ALL')
            setDevDays(clone)
        }
    }

    const handleDevDaysDeselect = (value) => {
        if (value == 'ALL') setDevDays([])
        else {
            const filtered = devDays.filter(day => day !== value && day !== "ALL")
            setDevDays(filtered)
        }
    }

    const handleProofUpload = (file, name) => {
        getBase64(file, async (buffer) => {
            setFormData(data => ({ ...data, [name]: buffer }))
            setFormErrors(errors => ({ ...errors, [name]: '' }))
        })
    }

    const handleProofRemove = (name) => {
        setFormData(data => ({ ...data, [name]: '' }))
    }

    const handleChange = (value, key) => {
        setFormData(data => ({ ...data, [key]: value }))
        setFormErrors(errors => ({ ...errors, [key]: '' }))

        if (key === 'departmentId') {
            setFormData(data => ({ ...data, routeId: null }))
            handleGetNewRouteList(value)
        }

        // Validations
        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        if (key === 'deliveryLocation') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'depositAmount') {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'contactPerson') {
            const error = validateNames(value)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key.includes('price') || key.includes('product')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
        }
    }

    const handleBlur = (value, key) => {
        // Validations
        if (key === 'gstNo') {
            const error = validateIDNumbers(key, value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
        else if (key === 'phoneNumber') {
            const error = validateMobileNumber(value, true)
            setFormErrors(errors => ({ ...errors, [key]: error }))
        }
    }

    const handleGetNewRouteList = (depId) => {
        if (currentDepId !== depId) {
            getRouteList(depId)
        }
    }

    const handleCreate = async () => {
        const deliveryErrors = validateDeliveryValues(formData)
        const devDaysError = validateDevDays(devDays)

        if (!isEmpty(deliveryErrors) || !isEmpty(devDaysError)) {
            setShake(true)
            setTimeout(() => setShake(false), 820)
            setFormErrors(deliveryErrors)
            setDevDaysError(devDaysError)
            return
        }

        const productsUI = extractProductsFromForm(formData)
        const products = getProductsForDB(productsUI)
        const deliveryDays = getDevDaysForDB(devDays)
        const formValues = extractDeliveryDetails(formData)
        const body = [{ ...formValues, isNew: true, delete: 0, isActive: 0, products, deliveryDays, customer_Id: departmentId }]

        const options = { item: 'Delivery details', v1Ing: 'Adding', v2: 'added' }
        const url = '/customer/updateDeliveryDetails'

        try {
            setBtnDisabled(true)
            showToast({ ...options, action: 'loading' })
            let { data: [data = {}] } = await http.POST(url, body)
            setRecentDelivery(data)
            showToast(options)
            onModalClose(true)
        } catch (error) {
            setBtnDisabled(false)
        }
    }

    const handleBack = () => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged) {
            setConfirmModal(true)
            setNavigateTo('back')
        }
        else goBack()
    }

    const onModalClose = (hasSaved) => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged && !hasSaved) {
            return setConfirmModal(true)
        }
        setViewModal(false)
        setBtnDisabled(false)
        setFormData({})
        setDevDays([])
        setFormErrors({})
        setDevDaysError({})
        resetTrackForm()

        if (navigateTo === 'back') goBack()
    }

    const handleConfirmModalOk = useCallback(() => {
        setConfirmModal(false);
        resetTrackForm()
        onModalClose()
    }, [navigateTo])

    const handleAccountUpdate = useCallback((title, address) => {
        setHeaderContent({ title, address })
    }, [])

    const handleConfirmModalCancel = useCallback(() => {
        setConfirmModal(false)
        setNavigateTo('')
    }, [])

    const handleModalCancel = useCallback(() => onModalClose(), [])
    const goBack = () => {
        const mainPathname = getMainPathname(pathname)
        history.push(mainPathname)
    }

    return (
        <Fragment>
            <Header data={headerContent} onClick={handleBack} />
            <div className='account-view-content'>
                <div className='app-tabs-container'>
                    <Overview data={account} warehouseOptions={warehouseOptions} onUpdate={handleAccountUpdate} />
                </div>
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
const { TabPane } = Tabs;
export default ViewAccount
