import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Spinner = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 32, color: '#0062FF' }} spin />;
    return <Spin indicator={antIcon} />
}

export default Spinner