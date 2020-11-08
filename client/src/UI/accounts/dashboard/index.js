import { Col, Row } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AccountCard from '../../../components/AccountCard';
import Spinner from '../../../components/Spinner';
import NoContent from '../../../components/NoContent';
import Header from './header';
import { getAPI } from '../../../utils/apis';
import { USERID } from '../../../utils/constants';

const Accounts = () => {
    const history = useHistory()
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let url = '/customer/getCustomerDetails/' + USERID
        getAPI(url).then(res => {
            setCustomers(res.data)
            setLoading(false)
        })
    }, [])

    const handleSearch = () => { }
    const handleSort = () => { }
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
                                    <AccountCard customerDetails={account} onClick={() => goToViewAccount(account.customerId)} />
                                </Col>
                            )) : <NoContent content='No Accounts To display' />
                    }
                </Row>
            </div>
        </Fragment>
    )
}
export default Accounts
