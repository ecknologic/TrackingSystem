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
import { getCreatorOptions, getDefaultOptions } from '../../../assets/fixtures';
import { complexDateSort, complexSort, tripleKeyComplexSearch, filterAccounts, isEmpty } from '../../../utils/Functions'

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
    const [businessList, setBusinessList] = useState([])
    const [creatorList, setCreatorList] = useState([])

    const pageSizeOptions = useMemo(() => generatePageSizeOptions(), [window.innerWidth])
    const businessOptions = useMemo(() => getDefaultOptions(businessList), [businessList])
    const creatorOptions = useMemo(() => getCreatorOptions(creatorList), [creatorList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }
    const isSMManager = ROLE === MARKETINGMANAGER

    useEffect(() => {
        getAccounts()
        getCreatorList()
        getBusinessList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getAccounts = async () => {
        const url = getUrl()

        try {
            const { data } = await http.GET(axios, url, config)
            setAccountsClone(data)
            setAccounts(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const getUrl = () => {
        const SMManagerUrl = 'customer/getMarketingCustomerDetails'
        const selfUrl = `customer/getCustomerDetails/${USERID}`

        if (isSMManager) return SMManagerUrl
        return selfUrl
    }

    const getBusinessList = async () => {
        const url = `bibo/getList/natureOfBusiness`

        try {
            const data = await http.GET(axios, url, config)
            setBusinessList(data)
        } catch (error) { }
    }

    const getCreatorList = async () => {
        const roleName = getRoleName()
        if (!roleName) return;

        const url = `users/getUsersByRole/${roleName}`

        try {
            const data = await http.GET(axios, url, config)
            setCreatorList(data)
        } catch (error) { }
    }

    const getRoleName = () => {
        if (isSMManager) return 'SalesAndMarketing'
        return ''
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

    const handleFilter = (filterInfo) => {
        const filtered = filterAccounts(accountsClone, filterInfo)
        setFilterON(true)
        setPageNumber(1)
        setAccounts(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
    }

    const handleFilterClear = () => {
        setPageNumber(1)
        setAccounts(accountsClone)
        setTotalCount(accountsClone.length)
        setFilteredClone([])
        setFilterON(false)
        handleSort(sortBy, false)
    }

    const onFilterChange = (data) => {
        const { business, status, account, creator } = data
        if (isEmpty(business) && isEmpty(status) && isEmpty(account) && isEmpty(creator)) handleFilterClear()
        else handleFilter(data)
    }

    const goToAddAccount = () => history.push('/manage-accounts/add-account')
    const goToViewAccount = (id) => history.push(`/manage-accounts/${id}`, { page: pageNumber })

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize
    const noPageSize = filterON || searchON

    return (
        <Fragment>
            <Header onSearch={handleSearch} onSort={onSort} onFilter={onFilterChange} onClick={goToAddAccount} creatorOptions={creatorOptions} businessOptions={businessOptions} />
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
