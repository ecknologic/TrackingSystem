import { Dropdown, Menu } from 'antd';
import React, { useState, useRef } from 'react';
import { isEmpty } from '../utils/Functions';
import { FilterIconGrey } from './SVG_Icons';
import CheckboxOption from './CheckboxOption';
import { accountFilterOptions, businessFilterOptions, statusFilterOptions } from '../assets/fixtures'

const AccountsFilter = ({ onChange, creatorOptions }) => {

    const dataRef = useRef({ business: [], status: [], account: [], creator: [] })
    const [visible, setVisible] = useState(false)

    const handleSelect = (option, target) => {
        dataRef.current[target].push(option)
        onChange(dataRef.current)
    }

    const handleDeselect = (option, target) => {
        const filtered = dataRef.current[target].filter((item) => item !== option)
        dataRef.current[target] = filtered
        onChange(dataRef.current)
    }

    const menu = () => (
        <Menu className='app-accounts-filter'>
            {
                !isEmpty(creatorOptions) && (
                    <Menu.ItemGroup title='Select Creator'>
                        {
                            creatorOptions.map((item) => {
                                return (
                                    <Menu.Item key={item.value}>
                                        <CheckboxOption
                                            value={item.value}
                                            option={item.option}
                                            onSelect={(value) => handleSelect(value, 'creator')}
                                            onDeselect={(value) => handleDeselect(value, 'creator')}
                                        />
                                    </Menu.Item>
                                )
                            })
                        }
                    </Menu.ItemGroup>
                )
            }
            <Menu.ItemGroup title='Select Account'>
                {
                    accountFilterOptions.map((item) => {
                        return (
                            <Menu.Item key={item.value}>
                                <CheckboxOption
                                    value={item.value}
                                    option={item.option}
                                    onSelect={(value) => handleSelect(value, 'account')}
                                    onDeselect={(value) => handleDeselect(value, 'account')}
                                />
                            </Menu.Item>
                        )
                    })
                }
            </Menu.ItemGroup>
            <Menu.ItemGroup title='Select Business'>
                {
                    businessFilterOptions.map((item) => {
                        return (
                            <Menu.Item key={item.value}>
                                <CheckboxOption
                                    value={item.value}
                                    option={item.option}
                                    onSelect={(value) => handleSelect(value, 'business')}
                                    onDeselect={(value) => handleDeselect(value, 'business')}
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
                                    onSelect={(value) => handleSelect(value, 'status')}
                                    onDeselect={(value) => handleDeselect(value, 'status')}
                                />
                            </Menu.Item>
                        )
                    })
                }
            </Menu.ItemGroup>
        </Menu>
    )

    return (
        <Dropdown
            overlay={menu}
            trigger={['click']}
            getPopupContainer={node => node.parentNode}
            visible={visible}
            onVisibleChange={(bool) => setVisible(bool)}
        >
            <div className='fiter-container'>
                <FilterIconGrey />
            </div>
        </Dropdown>
    )
}
export default AccountsFilter