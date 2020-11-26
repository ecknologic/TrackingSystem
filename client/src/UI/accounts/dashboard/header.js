import React, { useState } from 'react';
import SortBy from '../../../components/SortByDropdown';
import SearchInput from '../../../components/SearchInput';
import ViewsComponent from '../../../components/ViewsComponent';
import { PlusIconGrey } from '../../../components/SVG_Icons';
import CustomButton from '../../../components/CustomButton';
import '../../../sass/accounts.scss'
import AccountsFilter from '../../../components/AccountsFilter';

const Header = ({ onClick, onSearch, onSort, onFilter }) => {
    const [view, setView] = useState('card')

    return (
        <div className='manage-accounts-header'>
            <div className='heading-container'>
                <span className='title'>Manage Accounts</span>
                <CustomButton text='Create Account'
                    onClick={onClick}
                    className='app-create-acc-btn'
                    icon={<PlusIconGrey />}
                />
            </div>
            <div className='menu-container'>
                <div className='search-container'>
                    <SearchInput
                        placeholder='Search Accounts'
                        onSearch={onSearch}
                        onChange={onSearch}
                        width='60%'
                    />
                </div>
                <div className='rest-container'>
                    <ViewsComponent selected={view} onViewChange={(e) => setView(e)} />
                    <div className='op-container'>
                        <SortBy onSelect={onSort} />
                        <AccountsFilter onChange={onFilter} />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Header