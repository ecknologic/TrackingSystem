import { Tabs } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Header from './header';
import { http } from '../../../modules/http';
import DeliveryForm from '../add/forms/Delivery';
import AccountOverview from './tabs/AccountOverview';
import DeliveryDetails from './tabs/DeliveryDetails';
import NoContent from '../../../components/NoContent';
import QuitModal from '../../../components/CustomModal';
import CustomModal from '../../../components/CustomModal';
import CustomButton from '../../../components/CustomButton';
import { DocIconWhite } from '../../../components/SVG_Icons';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { getRole, SUPERADMIN, TRACKFORM } from '../../../utils/constants';
import { getRouteOptions, getWarehouseOptions, WEEKDAYS } from '../../../assets/fixtures';
import { validateDeliveryValues, validateDevDays, validateIDNumbers, validateIntFloat, validateMobileNumber, validateNames, validateNumber } from '../../../utils/validations';
import { extractDeliveryDetails, getProductsForDB, extractProductsFromForm, isEmpty, getDevDaysForDB, getBase64, resetTrackForm, showToast, getMainPathname } from '../../../utils/Functions';

const ViewAccount = () => {
    const history = useHistory()
    const { accountId } = useParams()
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

    const isSuperAdmin = useMemo(() => getRole() === SUPERADMIN, [])
    const routeOptions = useMemo(() => getRouteOptions(routeList), [routeList])
    const warehouseOptions = useMemo(() => getWarehouseOptions(warehouseList), [warehouseList])

    useEffect(() => {
        getAccount()
        getWarehouseList()
    }, [])

    const getAccount = async () => {
        const url = `/customer/getCustomerDetailsById/${accountId}`
        try {
            const { data: [data = {}] } = await http.GET(url)
            const { customerName, organizationName, Address1 } = data
            setAccount({ ...data, loading: false })
            setHeaderContent({
                title: organizationName || customerName,
                address: Address1
            })
        } catch (error) { }
    }

    const getWarehouseList = async () => {
        try {
            const data = await http.GET('/bibo/getDepartmentsList?departmentType=warehouse')
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
        else if (key.includes('product')) {
            const error = validateNumber(value)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
        }
        else if (key.includes('price')) {
            const error = validateIntFloat(value)
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
        else if (key.includes('price')) {
            const error = validateIntFloat(value, true)
            setFormErrors(errors => ({ ...errors, productNPrice: error }))
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
        const body = [{ ...formValues, isNew: true, delete: 0, isApproved: 0, products, deliveryDays, customer_Id: accountId }]

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

    const onAddNewDelivery = useCallback(() => {
        setViewModal(true)
    }, [])

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
                    <Tabs
                        onChange={(key) => setActiveTab(key)}
                        tabBarExtraContent={
                            activeTab === '2' &&
                            <CustomButton
                                className='extra-btn'
                                onClick={onAddNewDelivery}
                                icon={<DocIconWhite />}
                                text='Add new Delivery address' />
                        }
                    >
                        <TabPane tab="Account Overview" key="1">
                            <AccountOverview
                                data={account}
                                isSuperAdmin={isSuperAdmin}
                                onUpdate={handleAccountUpdate}
                            />
                        </TabPane>
                        <TabPane tab="Delivery Details" key="2">
                            <DeliveryDetails
                                isSuperAdmin={isSuperAdmin}
                                recentDelivery={recentDelivery}
                                warehouseOptions={warehouseOptions}
                            />
                        </TabPane>
                        <TabPane tab="Invoice" key="3" disabled>
                            <NoContent content='Design in progress' />
                        </TabPane>
                        <TabPane tab="Report Log" key="4" disabled>
                            <NoContent content='Design in progress' />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
            <CustomModal
                className={`app-form-modal ${shake ? 'app-shake' : ''}`}
                visible={viewModal}
                btnDisabled={btnDisabled}
                onOk={handleCreate}
                onCancel={handleModalCancel}
                title='Add New Delivery Address'
                okTxt='Save'
            >
                <DeliveryForm
                    data={formData}
                    errors={formErrors}
                    devDays={devDays}
                    devDaysError={devDaysError}
                    routeOptions={routeOptions}
                    warehouseOptions={warehouseOptions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onUpload={handleProofUpload}
                    onRemove={handleProofRemove}
                    onSelect={handleDevDaysSelect}
                    onDeselect={handleDevDaysDeselect}
                />
            </CustomModal>
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
