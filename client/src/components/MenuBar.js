import React from 'react';
import SortBy from './SortByDropdown';
import SearchInput from './SearchInput';
import StatusFilter from './StatusFilter';

const MenuBar = ({ searchText, onSearch, onSort, onFilter }) => {

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
                    <StatusFilter onChange={onFilter} />
                </div>
            </div>
        </div>
    )

}
export default MenuBar