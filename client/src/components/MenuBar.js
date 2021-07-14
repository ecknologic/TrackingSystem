import React from 'react';
import SortBy from './SortByDropdown';
import SearchInput from './SearchInput';
import StatusFilter from './StatusFilter';
import { statusFilterList } from '../assets/fixtures'

const MenuBar = ({ searchText, onSearch, onSort, onFilter, filterList = statusFilterList }) => {

    return (
        <div className='app-menu-container'>
            <div className='search-container'>
                <SearchInput
                    placeholder={searchText}
                    onChange={onSearch}
                    width='60%'
                />
            </div>
            <div className='rest-container'>
                <div className='op-container'>
                    <SortBy onSelect={onSort} />
                    <StatusFilter onChange={onFilter} filterList={filterList} />
                </div>
            </div>
        </div>
    )

}
export default MenuBar