import axios from 'axios';
import { Col, Empty, message, Row } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Header from './header';
import { http } from '../../modules/http'
import Spinner from '../../components/Spinner';
import useUser from '../../utils/hooks/useUser';
import NoContent from '../../components/NoContent';
import AccountCard from '../../components/AccountCard';
import DeleteModal from '../../components/CustomModal';
import ConfirmMessage from '../../components/ConfirmMessage';
import CustomPagination from '../../components/CustomPagination';
import useCustomerFilter from '../../utils/hooks/useCustomerFilter';
import { ACCOUNTSADMIN, MANAGEACCOUNT, MARKETINGADMIN, MARKETINGMANAGER, SUPERADMIN, VIEWDETAILS } from '../../utils/constants';
import { complexDateSort, complexSort, tripleKeyComplexSearch, filterAccounts, showToast } from '../../utils/Functions'
import '../../sass/customers.scss'

const Customers = () => {
    const { ROLE, USERID } = useUser()
    const history = useHistory()
    const { tab = '1', page = 1 } = useParams()
    const [accountsClone, setAccountsClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [cardBtnTxt, setCardBtnTxt] = useState(MANAGEACCOUNT)
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(Number(page))
    const [totalCount, setTotalCount] = useState(null)
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [sortBy, setSortBy] = useState('NEW - OLD')
    const [activeTab, setActiveTab] = useState(tab)
    const [modalDelete, setModalDelete] = useState(false)
    const [currentId, setCurrentId] = useState('')

    const { account, creator, business, hasFilters } = useCustomerFilter()
    const pageSizeOptions = useMemo(() => generatePageSizeOptions(), [window.innerWidth])
    const isAdmin = useMemo(() => ROLE === SUPERADMIN || ROLE === ACCOUNTSADMIN, [ROLE])
    const isSalesAdmin = useMemo(() => ROLE === MARKETINGADMIN, [ROLE])
    const isMarketingManager = useMemo(() => ROLE === MARKETINGMANAGER, [ROLE])
    const source = useMemo(() => axios.CancelToken.source(), [activeTab]);
    const config = { cancelToken: source.token }

    useEffect(() => {
        setLoading(true)
        getAccounts()

        if (activeTab === '3') {
            if (isAdmin) setCardBtnTxt(VIEWDETAILS)
            else setCardBtnTxt(MANAGEACCOUNT)
        }

        return () => {
            http.ABORT(source)
        }
    }, [activeTab])

    useEffect(() => {
        if (!loading) {
            const filters = { creator, business, account }
            if (!hasFilters) handleRemoveFilters()
            else handleApplyFilters(filters, accountsClone)
        }
    }, [account, creator, business])

    const getAccounts = async () => {
        const url = `customer/${getUrl(activeTab)}`

        try {
            const data = await http.GET(axios, url, config)
            if (hasFilters) {
                const filters = { business, account }
                handleApplyFilters(filters, data)
            }
            else {
                setAccounts(data)
                setTotalCount(data.length)
            }
            setAccountsClone(data)
            setLoading(false)
        } catch (error) { }
    }

    const getUrl = (tab) => {
        if (tab === '1') {
            if (isAdmin) return 'getCustomerDetailsByType?customerType=Corporate'
            else if (isSalesAdmin) return `getCustomerDetailsByType?customerType=Corporate&userId=${USERID}`
            else if (isMarketingManager) return 'getMarketingCustomerDetailsByType/Corporate'
        }
        else if (tab === '2') {
            if (isAdmin) return 'getCustomerDetailsByType?customerType=Individual'
            else if (isSalesAdmin) return `getCustomerDetailsByType?customerType=Individual&userId=${USERID}`
            else if (isMarketingManager) return 'getMarketingCustomerDetailsByType/Individual'
        }
        else if (tab === '3') {
            if (isAdmin) return 'getCustomerDetailsByStatus?status=0'
            else if (isSalesAdmin) return `getCustomerDetailsByStatus?status=0&userId=${USERID}`
            else if (isMarketingManager) return 'getMarketingCustomerDetailsByStatus?status=0'
        }
        else if (tab === '4') {
            if (isAdmin) return 'getInActiveCustomers'
            else if (isSalesAdmin) return `getInActiveCustomers?userId=${USERID}`
            else if (isMarketingManager) return 'getMarketingInActiveCustomers'
        }
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(accountsClone.length)
            setAccounts(accountsClone)
            setSeachON(false)
            return
        }
        const result = tripleKeyComplexSearch(accountsClone, value, 'organizationName', 'customerName', 'customerId')
        setTotalCount(result.length)
        setAccounts(result)
        setSeachON(true)
    }

    const onSort = (type) => {
        handleSort(type, filterON)
    }

    const handleSort = (type, filterON) => {
        const clone = [...(filterON ? filteredClone : accountsClone)]

        if (type === 'Z - A') {
            complexSort(clone, 'organizationName', 'desc')
        }
        else if (type === 'A - Z') {
            complexSort(clone, 'organizationName')
        }
        else if (type === 'OLD - NEW') {
            complexDateSort(clone, 'approvedDate')
        }
        else {
            complexDateSort(clone, 'approvedDate', 'desc')
        }

        filterON ? setFilteredClone(clone) : setAccountsClone(clone)
        setTotalCount(clone.length)
        setAccounts(clone)
        setSortBy(type)
    }

    const handlePageChange = (number) => {
        const clone = filterON ? filteredClone : accountsClone
        setPageNumber(number)
        setAccounts(clone)
    }

    const handleSizeChange = (number, size) => {
        const clone = filterON ? filteredClone : accountsClone
        setPageSize(size)
        setPageNumber(number)
        setAccounts(clone)
    }

    const handleTabChange = (key) => {
        http.ABORT(source)
        setPageNumber(1)
        setActiveTab(key)
        if (key === '3') {
            setCardBtnTxt(VIEWDETAILS)
        } else setCardBtnTxt(MANAGEACCOUNT)
    }

    const handleApplyFilters = (filterInfo, accounts) => {
        const filtered = filterAccounts(accounts, filterInfo)
        setFilterON(true)
        setPageNumber(1)
        setAccounts(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
    }

    const handleRemoveFilters = () => {
        setPageNumber(1)
        setAccounts(accountsClone)
        setTotalCount(accountsClone.length)
        setFilteredClone([])
        setFilterON(false)
        handleSort(sortBy, false)
    }

    const handleManageAccount = (id) => {
        if (cardBtnTxt === VIEWDETAILS) {
            return history.push(`/customers/approval/${id}`, { tab: activeTab, page: pageNumber })
        }
        return history.push(`/customers/manage/${id}`, { tab: activeTab, page: pageNumber })
    }

    const handleMenuSelect = (key, id, isSAApproved) => {
        if (key === 'Approve') {
            onAccountApprove(id, isSAApproved)
        }
        else if (key === 'Active') {
            handleStatusUpdate(id, 1)
        }
        else if (key === 'Draft') {
            handleStatusUpdate(id, 0)
        }
        else if (key === 'Delete') {
            setCurrentId(id)
            setModalDelete(true)
        }
        else if (key === 'Close') {
            handleAccountClose(id)
        }
    }

    const handleStatusUpdate = async (customerId, status) => {
        const options = { item: 'Customer status', v1Ing: 'Updating', v2: 'updated' }
        const url = `customer/updateCustomerStatus`
        const body = { status, customerId }
        try {
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            optimisticDelete(customerId)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const handleAccountClose = async (customerId) => {
        const options = { item: 'Customer', v1Ing: 'Closing', v2: 'closed' }
        const url = `customer/closeCustomer/${customerId}`
        try {
            showToast({ ...options, action: 'loading' })
            await http.GET(axios, url, config)
            optimisticDelete(customerId)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const onAccountApprove = async (customerId, isSuperAdminApproved) => {
        const options = { item: 'Customer', v1Ing: 'Approving', v2: 'approved' }
        const url = `customer/approveCustomerDirectly/${customerId}`
        const body = { isSuperAdminApproved }
        try {
            showToast({ ...options, action: 'loading' })
            await http.POST(axios, url, body, config)
            optimisticDelete(customerId)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const handleDelete = async (id) => {
        const options = { item: 'Customer', v1Ing: 'Deleting', v2: 'deleted' }
        const url = `customer/deleteCustomer/${id}`

        try {
            showToast({ ...options, action: 'loading' })
            await http.DELETE(axios, url, config)
            optimisticDelete(id)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const optimisticDelete = (id) => {
        if (filterON || searchON) {
            const filtered = accountsClone.filter(item => item.customerId !== id)
            setAccountsClone(filtered)
        }
        const filtered = accounts.filter(item => item.customerId !== id)
        setAccounts(filtered)
        setTotalCount(filtered.length)
    }

    const handleDeleteModalOk = useCallback(() => {
        setModalDelete(false);
        handleDelete(currentId)
    }, [currentId])

    const handleDeleteModalCancel = useCallback(() => {
        setModalDelete(false)
    }, [])

    const goToAddAccount = () => history.push('/customers/add-account')
    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize
    const noPageSize = filterON || searchON

    return (
        <Fragment>
            <Header activeTab={activeTab} onSearch={handleSearch} onSort={onSort} onChange={handleTabChange} onClick={goToAddAccount} />
            <div className='account-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 16, xl: 16 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : accounts.length ? accounts.slice(sliceFrom, sliceTo).map((account) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={account.customerId}>
                                    <AccountCard
                                        data={account}
                                        btnTxt={cardBtnTxt}
                                        isAdmin={isAdmin}
                                        optionOneLabel={activeTab === '3' ? 'Approve' : 'Active'}
                                        onSelect={handleMenuSelect}
                                        onClick={handleManageAccount}
                                    />
                                </Col>
                            )) : <NoContent content={<Empty />} />
                    }
                </Row>
                {
                    !!totalCount && (
                        <CustomPagination
                            total={totalCount}
                            pageSize={pageSize}
                            current={pageNumber}
                            onChange={handlePageChange}
                            pageSizeOptions={noPageSize ? [] : pageSizeOptions}
                            onPageSizeChange={handleSizeChange}
                        />)
                }
            </div>
            <DeleteModal
                visible={modalDelete}
                onOk={handleDeleteModalOk}
                onCancel={handleDeleteModalCancel}
                title='Are you sure you want to delete?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='This action cannot be undone.' />
            </DeleteModal>
        </Fragment>
    )
}

const generatePageSizeOptions = () => {
    if (window.innerWidth < 1200) return ['12', '16', '20', '24', '28']
    if (window.innerWidth >= 1200) return ['12', '15', '18', '21', '24']
    if (window.innerWidth >= 1600) return ['12', '16', '20', '24', '28']
    return ['12', '15', '18', '21', '24']
}
export default Customers
