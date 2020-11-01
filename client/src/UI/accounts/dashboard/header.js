import React, { useState } from 'react';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons'
import SortBy from '../../../components/SortByDropdown';
import SearchInput from '../../../components/SearchInput';
import ViewsComponent from '../../../components/ViewsComponent';
import '../../../sass/accounts.scss'

const Header = () => {
    const [view, setView] = useState('card')

    const handleSearch = (text) => {

    }
    const handleSort = (text) => {

    }

    return (
        <div className='manage-accounts-header'>
            <div className='heading-container'>
                <span className='title'>Manage Accounts</span>
                <div className='btn'>
                    <PlusOutlined />
                    <span>Create Account</span>
                </div>
            </div>
            <div className='menu-container'>
                <div className='search-container'>
                    <SearchInput
                        placeholder='Search Accounts'
                        onSearch={handleSearch}
                        onChange={handleSearch}
                        width='60%'
                    />
                </div>
                <div className='rest-container'>
                    <ViewsComponent selected={view} onViewChange={(e) => setView(e)} />
                    <div className='op-container'>
                        <SortBy onSelect={handleSort} />
                        <div className='fiter-container'>
                            <FilterOutlined />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Header