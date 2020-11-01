import { Col, Row } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AccountCard from '../../../components/AccountCard';
import Spinner from '../../../components/Spinner';
import NoContent from '../../../components/NoContent';
import Header from './header';

const Accounts = () => {
    const history = useHistory()
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cards = ['1', '2', '3', '4', '5', '6', '7', '8']
        setTimeout(() => {
            setCards(cards)
            setLoading(false)
        }, 2000)
    }, [])

    const accountId = '5e23c23ls942ea23456'

    const goToViewAccount = () => history.push(`/manage-accounts/${accountId}`)

    return (
        <Fragment>
            <Header />
            <div className='account-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 32, xl: 32 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : cards.length ? cards.map((item) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={item} >
                                    <AccountCard onClick={goToViewAccount} />
                                </Col>
                            )) : <NoContent content='No Accounts To display' />
                    }
                </Row>
            </div>
        </Fragment>
    )
}
export default Accounts
