import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import '../sass/sortByDropdown.scss'
import { DDownIcon } from './SVG_Icons';

const DropdownSelect = ({ width = '200px', onSelect }) => {
    const [value, setValue] = useState('NEW')

    const handleSelect = ({ key }) => {
        setValue(key)
        onSelect(key)
    }

    const menu = (
        <Menu onClick={handleSelect}>
            <Menu.Item key="A - Z" icon={<SortAscendingOutlined />}>
                A - Z
          </Menu.Item>
            <Menu.Item key="Z - A" icon={<SortDescendingOutlined />}>
                Z - A
          </Menu.Item>
            <Menu.Item key="NEW" >
                NEW
          </Menu.Item>
            <Menu.Item key="OLD" >
                OLD
          </Menu.Item>
        </Menu>
    );

    return (
        <div className='sort-by-drop-down-select-container' style={{ width }}>
            <Dropdown
                overlay={menu}
                trigger='click'
                className='sort-by-drop-down-select'
            >
                <div>
                    <div>
                        <span>Sort by:</span>
                        <span className='selected-item'>{` ${value}`}</span>
                    </div>
                    <DDownIcon className='down' />
                </div>
            </Dropdown>
        </div>
    )
}

export default DropdownSelect