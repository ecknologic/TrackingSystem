import React from 'react';

const NoContent = ({ content, style }) => {
    return (
        <div style={{ ...defaultStyle, ...style }} className='no-content'>
            {content}
        </div>
    )
}

const defaultStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

export default NoContent