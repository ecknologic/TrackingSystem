import React from 'react';
import '../sass/collapseHeader.scss';

const CollapseHeader = ({ title, msg }) => {
    return (
        <div className='app-collapse-header'>
            <div className='title'>{title}</div>
            <div className='msg'>{msg}</div>
        </div>
    )
}

export default CollapseHeader