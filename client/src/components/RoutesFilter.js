import { Dropdown, Menu } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import SearchInput from './SearchInput';
import { LinesIconGrey } from './SVG_Icons';
import CheckboxOption from './CheckboxOptionFunc';
import { doubleKeyComplexSearch } from '../utils/Functions';
import '../sass/routesDropdown.scss'

const RoutesDropdown = ({ data, onChange, title, keyValue, keyLabel }) => {

    const dataRef = useRef([])
    const [visible, setVisible] = useState(false)
    const [initial, setInitial] = useState([])
    const [display, setDisplay] = useState([])

    useEffect(() => {
        setInitial(data)
        setDisplay(data)
    }, [data.length])

    const handleSelect = (option) => {
        dataRef.current = [...dataRef.current, option]
        onChange(dataRef.current)
        handleCheckChange(option, true)
    }

    const handleDeselect = (option) => {
        const filtered = dataRef.current.filter((item) => item !== option)
        dataRef.current = filtered
        onChange(filtered)
        handleCheckChange(option, false)
    }

    const handleSearch = (value) => {
        const result = doubleKeyComplexSearch(initial, value, keyLabel)
        setDisplay(result)
    }

    const handleCheckChange = (option, checked) => {
        const data = [...initial]
        const index = data.findIndex(item => item[keyValue] === option)
        data[index].checked = checked
        setInitial(data)
    }

    const reportsMenu = (
        <Menu>
            <div className='filter-search-container'>
                <SearchInput
                    placeholder='Search'
                    width='100%'
                    onChange={handleSearch}
                />
            </div>
            <Menu.ItemGroup >
                {
                    display.map((item) => {
                        return (
                            <Menu.Item key={item[keyValue]}>
                                <CheckboxOption
                                    value={item[keyValue]}
                                    checked={item.checked}
                                    option={item[keyLabel]}
                                    onSelect={handleSelect}
                                    onDeselect={handleDeselect}
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
            overlay={reportsMenu}
            trigger={['click']}
            getPopupContainer={node => node.parentNode}
            className='routes-filter-dropdown'
            visible={visible}
            onVisibleChange={(bool) => setVisible(bool)}
        >
            <div>
                <span className='text' >{title}</span>
                <LinesIconGrey />
            </div>
        </Dropdown>
    )
}

export default RoutesDropdown