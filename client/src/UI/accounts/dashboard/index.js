import { Col, Row } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './header';
import AccountCard from '../../../components/AccountCard';
import Spinner from '../../../components/Spinner';
import NoContent from '../../../components/NoContent';
import { getUserId } from '../../../utils/constants';
import CustomModal from '../../../components/CustomModal';
import AccountsFilter from '../../../components/AccountsFilter';
import { complexDateSort, complexSort, doubleKeyComplexSearch } from '../../../utils/Functions'
import CustomPagination from '../../../components/CustomPagination';
import { http } from '../../../modules/http'

const Accounts = () => {
    const USERID = getUserId()
    const history = useHistory()
    const [accountsClone, setAccountsClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [filterModal, setFilterModal] = useState(false)
    const [filterInfo, setFilterInfo] = useState({})
    const [filterON, setFilterON] = useState(false)
    const [sortBy, setSortBy] = useState('NEW')

    const pageSizeOptions = useMemo(() => generatePageSizeOptions(), [window.innerWidth])

    useEffect(() => {
        getAccounts()
    }, [])

    const getAccounts = async () => {
        const url = `/customer/getCustomerDetails/${USERID}`

        const { data } = await http.GET(url)
        setAccountsClone(data)
        setAccounts(data)
        setTotalCount(data.length)
        setLoading(false)
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(accountsClone.length)
            setAccounts(accountsClone)
            return
        }
        const result = doubleKeyComplexSearch(accountsClone, value, 'organizationName', 'customerName')
        setTotalCount(result.length)
        setAccounts(result)
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
        else if (type === 'OLD') {
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

    const handleFilter = () => {
        const { natureOfBussiness, status } = filterInfo
        const filtered = accountsClone.filter((item) => {
            let match = false
            if (natureOfBussiness && (status === 0 || status === 1))
                match = (item.natureOfBussiness === natureOfBussiness) && (item.isActive === status)
            else match = (item.natureOfBussiness === natureOfBussiness) || (item.isActive === status)
            return match
        })
        setFilterON(true)
        setFilterModal(false)
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
        setFilterInfo({})
        setFilterON(false)
        setFilterModal(false)
        handleSort(sortBy, false)
    }

    const handleFilterInput = useCallback((value, key) => setFilterInfo(data => ({ ...data, [key]: value })), [])
    const onFilterClick = useCallback(() => setFilterModal(true), [])
    const handleModalCancel = useCallback(() => setFilterModal(false), [])

    const goToAddAccount = () => history.push('/manage-accounts/add-account')
    const goToViewAccount = (id) => history.push(`/manage-accounts/${id}`)

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <Header onSearch={handleSearch} onSort={onSort} onFilter={onFilterClick} onClick={goToAddAccount} />
            <div className='account-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 32, xl: 32 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : accounts.length ? accounts.slice(sliceFrom, sliceTo).map((account) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={account.customerId}>
                                    <AccountCard customerDetails={account} onClick={() => goToViewAccount(account.customerId)} />
                                </Col>
                            )) : <NoContent content='No accounts to show' />
                    }
                </Row>
                {
                    totalCount && (
                        <CustomPagination
                            total={totalCount}
                            pageSize={pageSize}
                            current={pageNumber}
                            onChange={handlePageChange}
                            pageSizeOptions={pageSizeOptions}
                            onPageSizeChange={handleSizeChange}
                        />)
                }
                <CustomModal
                    className='accounts-filter-modal'
                    visible={filterModal}
                    onOk={handleFilter}
                    onCancel={handleModalCancel}
                    onOther={handleFilterClear}
                    title='Filter By'
                    okTxt='Filter'
                    cancelTxt='Clear'
                >
                    <AccountsFilter
                        data={filterInfo}
                        onChange={handleFilterInput}
                    />
                </CustomModal>
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
