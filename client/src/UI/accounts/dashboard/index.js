import { Col, Row } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AccountCard from '../../../components/AccountCard';
import Spinner from '../../../components/Spinner';
import NoContent from '../../../components/NoContent';
import Header from './header';
import { getAPI } from '../../../utils/apis';
import { getUserId } from '../../../utils/constants';

const Accounts = () => {
    const USERID = getUserId()
    const history = useHistory()
    const [customers, setCustomers] = useState([])
    const [duplicateCustomers, setDuplicateCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('')

    useEffect(() => {
        let url = '/customer/getCustomerDetails/' + USERID
        getAPI(url).then(res => {
            setCustomers(res.data)
            setDuplicateCustomers(res.data)
            setLoading(false)
        })
    }, [])

    const handleSearch = (value) => {
        console.log("value", value)
        if (value.trim() != "") {
            let arr = []
            duplicateCustomers.length && duplicateCustomers.map(customer => {
                if (customer.organizationName && customer.organizationName.toLowerCase().includes(value.toLowerCase()) || customer.customerName.toLowerCase().includes(value.toLowerCase())) arr.push(customer)
            })
            setCustomers(arr)
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
    const handleFilter = () => { }

    const goToAddAccount = () => history.push('/manage-accounts/add-account')
    const goToViewAccount = (id) => history.push(`/manage-accounts/${id}`)

    return (
        <Fragment>
            <Header onSearch={handleSearch} onSort={handleSort} onFilter={handleFilter} onClick={goToAddAccount} />
            <div className='account-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 32, xl: 32 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : customers.length ? customers.map((account) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
                                    <AccountCard customerDetails={account} sortBy={sortBy} onClick={() => goToViewAccount(account.customerId)} />
                                </Col>
                            )) : <NoContent content='No Accounts To display' />
                    }
                </Row>
            </div>
        </Fragment>
    )
}
export default Accounts
