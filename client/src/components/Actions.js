import React from 'react';
import { Dropdown, Menu } from 'antd';
import { MoreIconGrey } from './SVG_Icons';

const Actions = ({ onSelect, options = [] }) => {
    const menu = (
        <Menu onClick={onSelect}>
            {options}
        </Menu>
    );

    return (
        <Dropdown
            overlay={menu}
            trigger={['click']}
            getPopupContainer={() => document.getElementById('content')}
        >
            <MoreIconGrey className='action-dots' />
        </Dropdown>
    )
}

export default Actions