import React from 'react';
import { Dropdown, Menu } from 'antd';
import CustomButton from './CustomButton';
import { DocIconLight, DocIconWhite } from './SVG_Icons';

const ReportsDropdown = ({ onSelect, inverse }) => {

    const reportsMenu = (
        <Menu onClick={() => { }}>
            <Menu.Item key="1">
                Stock Details
          </Menu.Item>
            <Menu.Item key="2">
                Delivery (DC)
          </Menu.Item>
            <Menu.Item key="3">
                Orders
          </Menu.Item>
            <Menu.Item key="4">
                Invoice
          </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown
            overlay={reportsMenu}
            trigger={['click']}
            getPopupContainer={() => document.getElementById('content')}
        >
            <CustomButton
                text='Get Reports'
                onClick={() => { }}
                icon={inverse ? <DocIconLight /> : <DocIconWhite />}
                className={`app-extra-btn ${inverse ? 'inverse' : ''}`} />
        </Dropdown>
    )
}

export default ReportsDropdown