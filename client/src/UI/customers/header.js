import { Tabs } from 'antd';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import SortBy from '../../components/SortByDropdown';
import SearchInput from '../../components/SearchInput';
import ViewsComponent from '../../components/ViewsComponent';
import AccountsFilter from '../../components/AccountsFilter';
import { PlusIconGrey } from '../../components/SVG_Icons';
import CustomButton from '../../components/CustomButton';

const Header = ({ activeTab, onChange, onSearch, onSort, onFilter, onClick }) => {
    const [view, setView] = useState('card')

    return (
        <div className='customers-header'>
            <div className='heading-container'>
                <span className='title'>Customers</span>
                <CustomButton text='Create Account'
                    onClick={onClick}
                    className='app-create-acc-btn'
                    icon={<PlusIconGrey />}
                />
            </div>
            <div className='app-tabs-container app-hidden-panes'>
                <Tabs
                    activeKey={activeTab}
                    onChange={onChange}
                >
                    <TabPane tab="Corporate Customers" key="1" />
                    <TabPane tab="Individual Customers" key="2" />
                    <TabPane tab="Customer Approvals" key="3" />
                    <TabPane tab="Inactive Customers" key="4" />
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