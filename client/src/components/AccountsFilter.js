import { Dropdown, Menu } from 'antd';
import React, { useState, useMemo } from 'react';
import { FilterIconGrey } from './SVG_Icons';
import CheckboxOption from './CheckboxOption';
import { businessFilterOptions, statusFilterOptions } from '../assets/fixtures'

const AccountsFilter = ({ onChange }) => {

    const [data, _] = useState([])
    const [visible, setVisible] = useState(false)

    const handleSelect = (option) => {
        data.push(option)
        onChange(data)
    }

    const handleDeselect = (option) => {
        data.filter((item) => item !== option)
        onChange(data)
    }

    const menu = useMemo(() => (
        <Menu className='app-accounts-filter'>
            <Menu.ItemGroup title='Select Business'>
                {
                    businessFilterOptions.map((item) => {
                        return (
                            <Menu.Item key={item.value}>
                                <CheckboxOption
                                    value={item.value}
                                    option={item.option}
                                    onSelect={handleSelect}
                                    onDeselect={handleDeselect}
                                />
                            </Menu.Item>
                        )
                    })
                }
            </Menu.ItemGroup>
            <Menu.ItemGroup title='Select Status'>
                {
                    statusFilterOptions.map((item) => {
                        return (
                            <Menu.Item key={item.value}>
                                <CheckboxOption
                                    value={item.value}
                                    option={item.option}
                                    onSelect={handleSelect}
                                    onDeselect={handleDeselect}
                                />
                            </Menu.Item>
                        )
                    })
                }
            </Menu.ItemGroup>
        </Menu>
    ), [])

    return (
        <Dropdown
            overlay={menu}
            trigger={['click']}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            visible={visible}
            onVisibleChange={(bool) => setVisible(bool)}
        >
            <div className='fiter-container'>
                <FilterIconGrey />
            </div>
        </Dropdown>
    )
}
const { SubMenu } = Menu;
export default AccountsFilter