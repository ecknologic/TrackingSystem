import { Menu } from 'antd';
import React from 'react';
import ButtonDropdown from './ButtonDropdown';
import CustomButton from './CustomButton';
import { DocIconWhite } from './SVG_Icons';

const ReportsDropdown = () => {

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
        <ButtonDropdown
            menu={reportsMenu}
            button={<CustomButton
                text='Get Reports'
                onClick={() => { }}
                icon={<DocIconWhite />}
                className='extra-btn' />
            }
        />
    )
}

export default ReportsDropdown