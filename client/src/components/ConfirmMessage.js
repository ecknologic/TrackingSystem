import React from 'react';
// import '../sass/confirmMessage.scss';

const ConfirmMessage = ({ msg }) => {
    return (
        <div className='success-msg-container'>
            <span className='msg'>{msg}</span>
        </div>
    )
}

export default ConfirmMessage