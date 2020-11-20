import React from 'react';
import { Divider } from 'antd';
import '../sass/viewsComponent.scss'
import { CardViewIcon, CardViewIconGrey, ListViewIconGrey, ListViewIcon } from './SVG_Icons';

const ViewsComponent = ({ selected, onViewChange }) => {

    return (
        <div className='views-container'>
            <div
                className={selected === 'card' ? 'selected menu-item' : 'menu-item'}
                onClick={() => onViewChange('card')}
            >
                {selected === 'card' ? <CardViewIcon className='icon' /> : <CardViewIconGrey className='icon' />}
                <span className='name'>Card View</span>
            </div>
            <Divider type="vertical" />
            <div
                className={selected === 'list' ? 'selected menu-item' : 'menu-item'}
                onClick={() => onViewChange('list')}
            >
                {selected === 'list' ? <ListViewIcon className='icon' /> : <ListViewIconGrey className='icon' />}
                <span className='name'>List View</span>
            </div>
        </div>
    )
}

export default ViewsComponent