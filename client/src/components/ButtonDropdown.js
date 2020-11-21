import React from 'react';
import { Dropdown } from 'antd';

const ButtonDropdown = ({ menu, button }) => {

    return (
        <Dropdown overlay={menu} trigger={['click']}>
            {button}
        </Dropdown>
    )
}

export default ButtonDropdown