import React from 'react';
import SortBy from './SortByDropdown';
import SearchInput from './SearchInput';
import StatusFilter from './StatusFilter';
import MultiStatusFilter from './MultiStatusFilter';

const MenuBar = ({ searchText, onSearch, onSort, isMulti }) => {

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
                    {isMulti ? <MultiStatusFilter /> : <StatusFilter />}
                </div>
            </div>
        </div>
    )

}
export default MenuBar