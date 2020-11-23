import { Col, Row } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
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
    const [totalCount, setTotalCount] = useState('')
    const [filterModal, setFilterModal] = useState(false)
    const [filterInfo, setFilterInfo] = useState({})
    const [filterON, setFilterON] = useState(false)
    const pageNumberRef = useRef(1)

    useEffect(() => {
        getAccounts()
    }, [])

    const getAccounts = async () => {
        const url = `/customer/getCustomerDetails/${USERID}`

        const { data } = await http.GET(url)
        setAccountsClone(data)
        setAccounts(data.slice(0, pageSize))
        setTotalCount(data.length)
        setLoading(false)
    }

    const handleSearch = (value) => {
        pageNumberRef.current = 1
        if (value === "") {
            setTotalCount(accountsClone.length)
            setAccounts(accountsClone.slice(0, pageSize))
            return
        }
        const result = doubleKeyComplexSearch(accountsClone, value, 'organizationName', 'customerName')
        setTotalCount(result.length)
        setAccounts(result)
    }

    const handleSort = (type) => {
        pageNumberRef.current = 1
        if (type === 'Z - A') {
            const clone = [...(filterON ? filteredClone : accountsClone)]
            complexSort(clone, 'organizationName', 'desc')
            filterON ? setFilteredClone(clone) : setAccountsClone(clone)
            setTotalCount(clone.length)
            setAccounts(clone.slice(0, pageSize))

            //Also sort the accountsClone when filter is ON
            complexSort(accountsClone, 'organizationName', 'desc')
        }
        else if (type === 'A - Z') {
            const clone = [...(filterON ? filteredClone : accountsClone)]
            complexSort(clone, 'organizationName')
            filterON ? setFilteredClone(clone) : setAccountsClone(clone)
            setTotalCount(clone.length)
            setAccounts(clone.slice(0, pageSize))

            //Also sort the accountsClone when filter is ON
            complexSort(accountsClone, 'organizationName')
        }
        else if (type === 'OLD') {
            const clone = [...(filterON ? filteredClone : accountsClone)]
            complexDateSort(clone, 'registeredDate')
            filterON ? setFilteredClone(clone) : setAccountsClone(clone)
            setTotalCount(clone.length)
            setAccounts(clone.slice(0, pageSize))

            //Also sort the accountsClone when filter is ON
            complexDateSort(accountsClone, 'registeredDate')
        }
        else {
            const clone = [...(filterON ? filteredClone : accountsClone)]
            complexDateSort(clone, 'registeredDate', 'desc')
            filterON ? setFilteredClone(clone) : setAccountsClone(clone)
            setTotalCount(clone.length)
            setAccounts(clone.slice(0, pageSize))

            //Also sort the accountsClone when filter is ON
            filterON && complexDateSort(accountsClone, 'registeredDate', 'desc')
        }
    }

    const handlePageChange = (number) => {
        pageNumberRef.current = number
        const sliceFrom = (number - 1) * pageSize
        const sliceTo = sliceFrom + pageSize
        const clone = filterON ? filteredClone : accountsClone
        const accounts = clone.slice(sliceFrom, sliceTo)
        setAccounts(accounts)
    }

    const handleSizeChange = (number, size) => {
        pageNumberRef.current = number
        const sliceFrom = (number - 1) * size
        const sliceTo = sliceFrom + size
        const clone = filterON ? filteredClone : accountsClone
        const accounts = clone.slice(sliceFrom, sliceTo)
        setPageSize(size)
        setAccounts(accounts)
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
        pageNumberRef.current = 1
        setAccounts(filtered.slice(0, pageSize))
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
        setFilterModal(false)
        setFilterON(true)
    }

    const handleFilterClear = () => {
        pageNumberRef.current = 1
        setAccounts(accountsClone.slice(0, pageSize))
        setTotalCount(accountsClone.length)
        setFilteredClone([])
        setFilterInfo({})
        setFilterON(false)
        setFilterModal(false)
    }

    const handleFilterInput = useCallback((value, key) => setFilterInfo(data => ({ ...data, [key]: value })), [])
    const onFilterClick = useCallback(() => setFilterModal(true), [])
    const handleModalCancel = useCallback(() => setFilterModal(false), [])

    const goToAddAccount = () => history.push('/manage-accounts/add-account')
    const goToViewAccount = (id) => history.push(`/manage-accounts/${id}`)

    return (
        <Fragment>
            <Header onSearch={handleSearch} onSort={handleSort} onFilter={onFilterClick} onClick={goToAddAccount} />
            <div className='account-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 32, xl: 32 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : accounts.length ? accounts.map((account) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={account.customerId}>
                                    <AccountCard customerDetails={account} onClick={() => goToViewAccount(account.customerId)} />
                                </Col>
                            )) : <NoContent content='No accounts to show' />
                    }
                </Row>
                {
                    !!accounts.length && (
                        <CustomPagination
                            total={totalCount}
                            pageSize={pageSize}
                            current={pageNumberRef.current}
                            onChange={handlePageChange}
                            pageSizeOptions={['12', '15', '18', '21', '24']}
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
export default Accounts
