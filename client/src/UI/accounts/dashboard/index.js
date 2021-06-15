import axios from 'axios';
import { Col, Empty, Row } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import Header from './header';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import useUser from '../../../utils/hooks/useUser';
import NoContent from '../../../components/NoContent';
import AccountCard from '../../../components/AccountCard';
import { MARKETINGMANAGER } from '../../../utils/constants';
import CustomPagination from '../../../components/CustomPagination';
import useCustomerFilter from '../../../utils/hooks/useCustomerFilter';
import { complexDateSort, complexSort, tripleKeyComplexSearch, filterAccounts } from '../../../utils/Functions'

const Accounts = () => {
    const history = useHistory()
    const { USERID, ROLE } = useUser()
    const { page = 1 } = useParams()
    const [accountsClone, setAccountsClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(Number(page))
    const [totalCount, setTotalCount] = useState(null)
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [sortBy, setSortBy] = useState('NEW - OLD')

    const isSMManager = useMemo(() => ROLE === MARKETINGMANAGER, [ROLE])
    const { account, creator, business, status, hasFilters } = useCustomerFilter()
    const pageSizeOptions = useMemo(() => generatePageSizeOptions(), [window.innerWidth])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getAccounts()

        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        if (!loading) {
            const filters = { business, status, account, creator }
            if (!hasFilters) handleRemoveFilters()
            else handleApplyFilters(filters, accountsClone)
        }
    }, [account, creator, business, status])

    const getAccounts = async () => {
        const url = getUrl()

        try {
            const { data } = await http.GET(axios, url, config)
            if (hasFilters) {
                const filters = { business, status, account, creator }
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

    const getUrl = () => {
        const SMManagerUrl = 'customer/getMarketingCustomerDetails'
        const selfUrl = `customer/getCustomerDetails/${USERID}`

        if (isSMManager) return SMManagerUrl
        return selfUrl
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
        // setPageNumber(1)
        const clone = [...(filterON ? filteredClone : accountsClone)]

        if (type === 'Z - A') {
            complexSort(clone, 'organizationName', 'desc')
        }
        else if (type === 'A - Z') {
            complexSort(clone, 'organizationName')
        }
        else if (type === 'OLD - NEW') {
            complexDateSort(clone, 'registeredDate')
        }
        else {
            complexDateSort(clone, 'registeredDate', 'desc')
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

    const goToAddAccount = () => history.push('/customer-accounts/add-account')
    const goToViewAccount = (id) => history.push(`/customer-accounts/manage/${id}`, { page: pageNumber })

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize
    const noPageSize = filterON || searchON

    return (
        <Fragment>
            <Header onSearch={handleSearch} onSort={onSort} onClick={goToAddAccount} />
            <div className='account-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 16, xl: 16 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : accounts.length ? accounts.slice(sliceFrom, sliceTo).map((account) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={account.customerId}>
                                    <AccountCard data={account} onClick={goToViewAccount} />
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
        </Fragment>
    )
}

const generatePageSizeOptions = () => {
    if (window.innerWidth < 1200) return ['12', '16', '20', '24', '28']
    if (window.innerWidth >= 1200) return ['12', '15', '18', '21', '24']
    if (window.innerWidth >= 1600) return ['12', '16', '20', '24', '28']
    return ['12', '15', '18', '21', '24']
}
export default Accounts
