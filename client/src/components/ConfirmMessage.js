import React from 'react';

const ConfirmMessage = ({ msg }) => {
    return (
        <div className='success-msg-container'>
            <span className='msg'>{msg}</span>
        </div>
    )
}

export default ConfirmMessage