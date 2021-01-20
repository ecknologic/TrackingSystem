import React from 'react';
import { Dropdown, Menu } from 'antd';
import CustomButton from './CustomButton';
import { DocIconWhite } from './SVG_Icons';

const ReportsDropdown = ({ onSelect }) => {

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
            getPopupContainer={node => node.parentNode}
        >
            <CustomButton
                text='Get Reports'
                onClick={() => { }}
                icon={<DocIconWhite />}
                className='extra-btn' />
        </Dropdown>
    )
}

export default ReportsDropdown