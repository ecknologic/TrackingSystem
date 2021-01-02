import React from 'react';
import { Dropdown, Menu } from 'antd';
import { ArrowIconGrey, MoreIconGrey, EditIconGrey, TrashIconGrey, FileIconGrey } from './SVG_Icons';

const TableAction = ({ onSelect }) => {
    const reportsMenu = (
        <Menu onClick={onSelect}>
            <Menu.Item key="view" icon={<EditIconGrey />}>
                View/Edit
          </Menu.Item>
            <Menu.Item key="delete" icon={<TrashIconGrey />}>
                Delete
          </Menu.Item>
            <Menu.Item key="route" icon={<ArrowIconGrey />}>
                Change Route
          </Menu.Item>
            <Menu.Item key="invoice" icon={<FileIconGrey />}>
                Generate Invoice
          </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown
            overlay={reportsMenu}
            trigger={['click']}
            getPopupContainer={() => document.getElementById('content')}
        >
            <MoreIconGrey className='action-dots' />
        </Dropdown>
    )
}

export default TableAction