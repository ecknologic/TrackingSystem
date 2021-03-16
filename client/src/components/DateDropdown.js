import React from 'react';
import { Dropdown, Menu } from 'antd';
import { ScheduleIcon } from './SVG_Icons';

const DateDropdown = ({ onSelect }) => {

    const dateMenu = (
        <Menu onClick={onSelect}>
            <Menu.Item key="date">
                Date
          </Menu.Item>
            <Menu.Item key="range">
                Range
          </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown
            overlay={dateMenu}
            trigger={['click']}
            getPopupContainer={() => document.getElementById('content')}
        >
            <div className='date-picker'>
                <ScheduleIcon />
                <span>Select</span>
            </div>
        </Dropdown>
    )
}

export default DateDropdown