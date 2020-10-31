import { Col, Row } from 'antd';
import React from 'react';
import AccountCard from '../../components/AccountCard';
import LayoutPage from '../Layout';
import Header from './header';

const Accounts = () => {

    const cards = ['1', '2', '3', '4', '5', '6', '7', '8']

    return (
        <LayoutPage>
            <Header />
            <div className='account-manager-content'>
                <Row gutter={[16, 32]}>
                    {/* <Col span={24}> */}

                    {
                        cards.map(() => (
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 22 }}
                                md={{ span: 24 }}
                                lg={{ span: 12 }}
                                xl={{ span: 8 }}
                                xxl={{ span: 6 }}

                            >
                                <AccountCard />
                            </Col>
                        ))
                    }
                    {/* </Col> */}
                </Row>
            </div>

        </LayoutPage>
    )

}

export default Accounts