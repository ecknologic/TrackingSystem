import React from 'react';
import SortBy from '../../../components/SortByDropdown';
import SearchInput from '../../../components/SearchInput';
import { PlusIconGrey } from '../../../components/SVG_Icons';
import CustomButton from '../../../components/CustomButton';
import AccountsFilter from '../../../components/AccountsFilter';
import '../../../sass/accounts.scss'

const Header = ({ onClick, onSearch, onSort, onFilter, creatorOptions }) => {

    return (
        <div className='manage-accounts-header'>
            <div className='heading-container'>
                <span className='title'>Manage Accounts</span>
                <CustomButton text='Add Account'
                    onClick={onClick}
                    className='app-create-acc-btn'
                    icon={<PlusIconGrey />}
                />
            </div>
            <div className='app-menu-container'>
                <div className='search-container'>
                    <SearchInput
                        placeholder='Search Accounts'
                        onChange={onSearch}
                        width='60%'
                    />
                </div>
                <div className='rest-container'>
                    <div className='op-container'>
                        <SortBy onSelect={onSort} />
                        <AccountsFilter onChange={onFilter} creatorOptions={creatorOptions} />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Header