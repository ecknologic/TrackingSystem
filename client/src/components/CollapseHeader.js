import React from 'react';
import '../sass/collapseHeader.scss';

const CollapseHeader = ({ title, msg, extra = null }) => {

    return (
        <div className='app-collapse-header'>
            <div className='header'>
                <div className='title'>{title}</div>
                <div className='msg clamp-1'>{msg}</div>
            </div>
            {
                extra
            }
        </div>
    )
}

export default CollapseHeader