import { Tabs } from 'antd';
import React, { useState } from 'react';
import SortBy from '../../components/SortByDropdown';
import SearchInput from '../../components/SearchInput';
import ViewsComponent from '../../components/ViewsComponent';
import AccountsFilter from '../../components/AccountsFilter';

const Header = ({ onChange, onSearch, onSort, onFilter }) => {
    const [view, setView] = useState('card')

    return (
        <div className='customers-header'>
            <div className='heading-container'>
                <span className='title'>Customers</span>
            </div>
            <div className='app-tabs-container app-hidden-panes'>
                <Tabs
                    onChange={onChange}
                >
                    <TabPane tab="Corporate Customers" key="1" />
                    <TabPane tab="Individual Customers" key="2" />
                    <TabPane tab="Customer Approvals" key="3" />
                </Tabs>
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
const { TabPane } = Tabs
export default Header