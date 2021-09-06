import { Dropdown, Menu } from 'antd';
import React, { useState } from 'react';
import { FilterIconGrey } from './SVG_Icons';
import CheckboxOption from './CheckboxOption';
import useStatusFilter from '../utils/hooks/useStatusFilter';

const StatusFilter = () => {

    const { onSelect, onDeselect, status } = useStatusFilter()
    const [visible, setVisible] = useState(false)

    const menu = () => (
        <Menu className='app-accounts-filter'>
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
export default StatusFilter