import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import '../sass/sortByDropdown.scss'

const DropdownSelect = ({ width = '200px', onSelect }) => {
    const [value, setValue] = useState('A - Z')

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
                    <DownOutlined />
                </div>
            </Dropdown>
        </div>
    )
}

export default DropdownSelect