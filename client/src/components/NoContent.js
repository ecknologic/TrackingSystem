import React from 'react';

const NoContent = ({ content }) => {
    return (
        <div style={style} id='no-content-container'>
            {content}
        </div>
    )
}

const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

export default NoContent