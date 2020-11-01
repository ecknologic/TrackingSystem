import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import Spinner from '../../../../components/Spinner';
import NoContent from '../../../../components/NoContent';
import AddressCard from '../../../../components/AddressCard';

const DeliveryDetails = () => {

    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cards = ['1', '2', '3', '4', '5', '6', '7', '8']
        setTimeout(() => {
            setCards(cards)
            setLoading(false)
        }, 2000)
    }, [])

    return (
        <div className='account-view-delivery-details'>
            <Row gutter={[{ lg: 32, xl: 16 }, { lg: 32, xl: 32 }]}>
                {
                    loading ? <NoContent content={<Spinner />} />
                        : cards.length ? cards.map(() => (
                            <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} >
                                <AddressCard onClick={() => { }} />
                            </Col>
                        )) : <NoContent content='No Accounts To display' />
                }
            </Row>
        </div>
    )
}
export default DeliveryDetails
