import { Dropdown, Menu } from 'antd';
import React, { useState } from 'react';
import { isEmpty } from '../utils/Functions';
import { FilterIconGrey } from './SVG_Icons';
import CheckboxOption from './CheckboxOption';
import useCustomerFilters from '../utils/hooks/useCustomerFilter';

const AccountsFilter = () => {
    const { onSelect, onDeselect, account, creator, business, status } = useCustomerFilters()
    const [visible, setVisible] = useState(false)

    const menu = () => (
        <Menu className='app-accounts-filter'>
            {
                !isEmpty(creator) && (
                    <Menu.ItemGroup title='Select Creator'>
                        {
                            creator.map(({ name, value, checked }) => {
                                return (
                                    <Menu.Item key={value}>
                                        <CheckboxOption
                                            value={value}
                                            option={name}
                                            checked={checked}
                                            onSelect={(value) => onSelect(value, 'creator')}
                                            onDeselect={(value) => onDeselect(value, 'creator')}
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
                    account.map(({ name, value, checked }) => {
                        return (
                            <Menu.Item key={value}>
                                <CheckboxOption
                                    value={value}
                                    option={name}
                                    checked={checked}
                                    onSelect={(value) => onSelect(value, 'account')}
                                    onDeselect={(value) => onDeselect(value, 'account')}
                                />
                            </Menu.Item>
                        )
                    })
                }
            </Menu.ItemGroup>
            <Menu.ItemGroup title='Select Business'>
                {
                    business.map(({ name, value, checked }) => {
                        return (
                            <Menu.Item key={value}>
                                <CheckboxOption
                                    value={value}
                                    option={name}
                                    checked={checked}
                                    onSelect={(value) => onSelect(value, 'business')}
                                    onDeselect={(value) => onDeselect(value, 'business')}
                                />
                            </Menu.Item>
                        )
                    })
                }
            </Menu.ItemGroup>
            <Menu.ItemGroup title='Select Status'>
                {
                    status.map(({ name, value, checked }) => {
                        return (
                            <Menu.Item key={value}>
                                <CheckboxOption
                                    value={value}
                                    option={name}
                                    checked={checked}
                                    onSelect={(value) => onSelect(value, 'status')}
                                    onDeselect={(value) => onDeselect(value, 'status')}
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