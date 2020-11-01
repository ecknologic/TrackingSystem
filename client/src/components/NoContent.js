import { Col } from 'antd';
import React from 'react';

const NoContent = ({ content }) => {
    return (
        <Col span={24} style={style} id='no-content-container'>
            {content}
        </Col>
    )
}

const style = {
    minHeight: 'calc(100vh - 19.5em)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

export default NoContent