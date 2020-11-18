import { Col, Pagination, Row } from 'antd';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AccountCard from '../../../components/AccountCard';
import Spinner from '../../../components/Spinner';
import NoContent from '../../../components/NoContent';
import Header from './header';
import { getAPI } from '../../../utils/apis';
import { getUserId } from '../../../utils/constants';
import CustomModal from '../../../components/CustomModal';
import AccountsFilter from '../../../components/AccountsFilter';

const Accounts = () => {
    const USERID = getUserId()
    const history = useHistory()
    const [customers, setCustomers] = useState([])
    const [duplicateCustomers, setDuplicateCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('')
    const [total, setTotal] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const [filterModal, setFilterModal] = useState(false)
    const [filterInfo, setFilterInfo] = useState({})

    useEffect(() => {
        let url = '/customer/getCustomerDetails/' + USERID
        getAPI(url).then(res => {
            setCustomers(res.data.slice(0, 12))
            setTotal(res.data.length)
            setDuplicateCustomers(res.data)
            setLoading(false)
        })
    }, [])

    const handleSearch = (value) => {
        if (value.trim() != "") {
            let arr = []
            duplicateCustomers.length && duplicateCustomers.map(customer => {
                if (customer.organizationName && customer.organizationName.toLowerCase().includes(value.toLowerCase()) || customer.customerName.toLowerCase().includes(value.toLowerCase())) arr.push(customer)
            })
        } else setCustomers(duplicateCustomers)
    }

    const handleSort = (e) => {
        if (e == 'Z - A') {
            let sortedArr = customers.length && customers.sort((a, b) => a.organizationName && a.organizationName !== b.organizationName ? b.organizationName < a.organizationName ? -1 : 1 : 0);
            setCustomers(sortedArr)
            setDuplicateCustomers(sortedArr)
        } else {
            let sortedArr = customers.length && customers.sort((a, b) => a.organizationName && a.organizationName !== b.organizationName ? a.organizationName < b.organizationName ? -1 : 1 : 0);
            setCustomers(sortedArr)
            setDuplicateCustomers(sortedArr)
        }
        setSortBy(e)
    }

    const onFilterClick = () => {
        setFilterModal(true)
    }

    const handleFilterInput = (value, key) => {
        setFilterInfo(data => ({ ...data, [key]: value }))
    }

    const handleFilter = () => {

    }

    const handlePageChange = (number) => {
        setPageNumber(number)
        const from = (number - 1) * 12
        const to = from + 12
        const customers = duplicateCustomers.slice(from, to)
        setCustomers(customers)
    }

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
                            : customers.length ? customers.map((account) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
                                    <AccountCard customerDetails={account} sortBy={sortBy} onClick={() => goToViewAccount(account.customerId)} />
                                </Col>
                            )) : <NoContent content='No accounts to show' />
                    }
                </Row>
                {
                    !!customers.length && (
                        <Pagination
                            defaultCurrent={1}
                            total={total}
                            pageSize={12}
                            current={pageNumber}
                            onChange={handlePageChange}
                        />)
                }
                <CustomModal
                    className='accounts-filter-modal'
                    visible={filterModal}
                    onOk={handleFilter}
                    onCancel={handleModalCancel}
                    title='Filter By'
                    okTxt='Filter'
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
