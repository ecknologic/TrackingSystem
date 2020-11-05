import React, { useState } from 'react';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom';
import SortBy from '../../../components/SortByDropdown';
import SearchInput from '../../../components/SearchInput';
import ViewsComponent from '../../../components/ViewsComponent';
import '../../../sass/accounts.scss'

const Header = ({ onClick, onSearch, onSort, onFilter }) => {
    const history = useHistory()
    const [view, setView] = useState('card')

    return (
        <div className='manage-accounts-header'>
            <div className='heading-container'>
                <span className='title'>Manage Accounts</span>
                <div className='btn' onClick={onClick}>
                    <PlusOutlined />
                    <span>Create Account</span>
                </div>
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
                        <div className='fiter-container' onClick={onFilter}>
                            <FilterOutlined />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Header