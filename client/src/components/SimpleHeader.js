import React from 'react';

const SimpleHeader = ({ title }) => {
    return (
        <div className='app-simple-header'>
            <span className='title'>{title}</span>
        </div>
    )
}

export default SimpleHeader