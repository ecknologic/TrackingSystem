import axios from 'axios';
import { Col, Empty, Row } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import Header from './header';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import NoContent from '../../../components/NoContent';
import { getUserId } from '../../../utils/constants';
import AccountCard from '../../../components/AccountCard';
import CustomPagination from '../../../components/CustomPagination';
import { complexDateSort, complexSort, doubleKeyComplexSearch, filterAccounts } from '../../../utils/Functions'

const Accounts = () => {
    const USERID = getUserId()
    const history = useHistory()
    const [accountsClone, setAccountsClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [sortBy, setSortBy] = useState('NEW - OLD')

    const pageSizeOptions = useMemo(() => generatePageSizeOptions(), [window.innerWidth])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getAccounts()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getAccounts = async () => {
        const url = `/customer/getCustomerDetails/${USERID}`

        try {
            const { data } = await http.GET(axios, url, config)
            setAccountsClone(data)
            setAccounts(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(accountsClone.length)
            setAccounts(accountsClone)
            setSeachON(false)
            return
        }
        const result = doubleKeyComplexSearch(accountsClone, value, 'organizationName', 'customerName')
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
        const { business, status, account } = data
        if (!business.length && !status.length && !account.length) handleFilterClear()
        else handleFilter(data)
    }

    const goToAddAccount = () => history.push('/manage-accounts/add-account')
    const goToViewAccount = (id) => history.push(`/manage-accounts/${id}`)

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize
    const noPageSize = filterON || searchON

    return (
        <Fragment>
            <Header onSearch={handleSearch} onSort={onSort} onFilter={onFilterChange} onClick={goToAddAccount} />
            <div className='account-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 32, xl: 32 }]}>
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
