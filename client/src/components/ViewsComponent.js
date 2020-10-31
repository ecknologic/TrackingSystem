import React from 'react';
import { Divider } from 'antd';
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons'
import '../sass/viewsComponent.scss'

const ViewsComponent = ({ selected, onViewChange }) => {

    return (
        <div className='views-container'>
            <div
                className={selected === 'card' ? 'selected menu-item' : 'menu-item'}
                onClick={() => onViewChange('card')}
            >
                <AppstoreOutlined />
                <span>Card View</span>
            </div>
            <Divider type="vertical" />
            <div
                className={selected === 'list' ? 'selected menu-item' : 'menu-item'}
                onClick={() => onViewChange('list')}
            >
                <UnorderedListOutlined />
                <span>List View</span>
            </div>
        </div>
    )
}

export default ViewsComponent