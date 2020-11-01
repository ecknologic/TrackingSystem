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
        // const customers = ['1', '2', '3', '4', '5', '6', '7', '8'];
        let url = '/customer/getCustomerDetails/' + USERID
        getAPI(url).then(res => {
            setCustomers(res.data)
            setLoading(false)
        })
        // setTimeout(() => {
        //     setCustomers(customers)
        // }, 2000)
    }, [])

    const accountId = '5e23c23ls942ea23456'

    const goToViewAccount = (id) => history.push(`/accounts/${id}`)

    return (
        <Fragment>
            <Header />
            <div className='account-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 32, xl: 32 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : customers.length ? customers.map((account) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} >
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
